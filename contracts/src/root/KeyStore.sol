// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;
import {ReentrancyGuard} from "../lib/ReentrancyGuard.sol";
import {IAMBHeaderReporter} from "./IAMBHeaderReporter.sol";

/**
 * @title KeyStore
 * @notice derived from author verum's Social Recovery Wallet
 */

contract KeyStore is ReentrancyGuard {
    /************************************************
     *  STORAGE
     ***********************************************/

    /// @notice true if hash of guardian address, else false
    mapping(bytes32 => bool) public isGuardian;

    /// @notice stores the guardian threshold for each address
    uint256 public threshold;

    /// @notice verification key of each address
    address public verificationKey;

    /// @notice wallets managed by a given verification key
    mapping(address => bool) public isWalletManaged;
    mapping(address => uint256[]) public walletManagedNetworks;
    address[] walletsManaged;

    /// @notice stores the total count of wallets managed
    uint256 public totalWalletsManaged;

    /// @notice true if verification key is in recovery mode
    bool public isVerificationKeyInRecovery;

    /// @notice round of recovery we're in for verificationKey
    uint256 public currentVerificationKeyRecoveryRound;

    /// @notice mapping for bookkeeping when swapping guardians
    mapping(bytes32 => uint256) public guardianHashToRemovalTimestamp;

    /// @notice stores the blockNumber when key was updated
    uint256 public keyUpdateBlockNumber;

    /// @notice struct used for bookkeeping during recovery mode
    /// @dev trival struct but can be extended in future (when building for malicious guardians
    /// or when owner key is compromised)
    struct Recovery {
        address proposedOwner;
        uint256 recoveryRound; // recovery round in which this recovery struct was created
        bool usedInExecuteRecovery; // set to true when we see this struct in RecoveryExecute
    }

    /// @notice mapping from guardian address to most recent Recovery struct created by them
    mapping(address => Recovery) public guardianToRecovery;

    /************************************************
     *  MODIFIERS & EVENTS
     ***********************************************/

    modifier onlyVerificationKeyOwner() {
        require(msg.sender == verificationKey, "only owner");
        _;
    }

    modifier onlyGuardian() {
        require(
            isGuardian[keccak256(abi.encodePacked(msg.sender))],
            "only guardian"
        );
        _;
    }

    modifier notInRecovery() {
        require(!isVerificationKeyInRecovery, "wallet is in recovery mode");
        _;
    }

    modifier onlyInRecovery() {
        require(isVerificationKeyInRecovery, "wallet is not in recovery mode");
        _;
    }

    /// @notice emitted when new wallet is registered
    event NewWalletRegistered(address indexed walletAddress, uint256 chainId);

    /// @notice emitted when guardian transfers ownership
    event GuardinshipTransferred(
        address indexed from,
        bytes32 indexed newGuardianHash
    );

    /// @notice emit when recovery initiated
    event RecoveryInitiated(
        address indexed by,
        address newProposedVerificationKey,
        uint256 indexed round
    );

    /// @notice emit when recovery supported
    event RecoverySupported(
        address by,
        address newProposedVerificationKey,
        uint256 indexed round
    );

    /// @notice emit when recovery is cancelled
    event RecoveryCancelled(address by, uint256 indexed round);

    /// @notice emit when recovery is executed
    event RecoveryExecuted(
        address oldVerificationKey,
        address newVerificationKey,
        uint256 indexed round
    );

    /// @notice emit when guardian queued for removal
    event GuardianRemovalQueued(bytes32 indexed guardianHash);

    /// @notice emit when guardian removed
    event GuardianRemoved(
        bytes32 indexed oldGuardianHash,
        bytes32 indexed newGuardianHash
    );

    /// @notice emit when guardian reveals themselves
    event GuardianRevealed(
        bytes32 indexed guardianHash,
        address indexed guardianAddr
    );

    /**
     * @notice Sets guardian hashes and threshold
     * @param guardianAddrHashes - array of guardian address hashes
     */
    constructor(bytes32[] memory guardianAddrHashes, uint256 _threshold) {
        require(_threshold <= guardianAddrHashes.length, "threshold too high");

        for (uint i = 0; i < guardianAddrHashes.length; i++) {
            require(!isGuardian[guardianAddrHashes[i]], "duplicate guardian");
            isGuardian[guardianAddrHashes[i]] = true;
        }

        threshold = _threshold;
        verificationKey = msg.sender;
    }

    /************************************************
     *  Register an address
     ***********************************************/

    function registerWallet(
        address _walletAddress,
        uint256 _chainId
    ) external onlyVerificationKeyOwner notInRecovery {
        require(
            !isWalletManaged[_walletAddress],
            "Wallet is already registered"
        );
        isWalletManaged[_walletAddress] = true;
        walletManagedNetworks[_walletAddress].push(_chainId);
        walletsManaged[totalWalletsManaged] = _walletAddress;

        totalWalletsManaged++;
        emit NewWalletRegistered(_walletAddress, _chainId);
    }

    /************************************************
     *  Recovery
     ***********************************************/

    /**
     * @notice Allows a guardian to initiate a wallet recovery
     * Wallet cannot already be in recovery mode
     * @param _proposedVerificationKey - address of the new propsoed owner
     */
    function initiateRecovery(
        address _proposedVerificationKey
    ) external onlyGuardian notInRecovery {
        require(
            _proposedVerificationKey != verificationKey,
            "Same as current verification key"
        );
        // we are entering a new recovery round
        currentVerificationKeyRecoveryRound++;
        guardianToRecovery[msg.sender] = Recovery(
            _proposedVerificationKey,
            currentVerificationKeyRecoveryRound,
            false
        );
        isVerificationKeyInRecovery = true;
        emit RecoveryInitiated(
            msg.sender,
            _proposedVerificationKey,
            currentVerificationKeyRecoveryRound
        );
    }

    /**
     * @notice Allows a guardian to support a wallet recovery
     * Wallet must already be in recovery mode
     * @param _proposedVerificationKey - address of the proposed owner;
     */
    function supportRecovery(
        address _proposedVerificationKey
    ) external onlyGuardian onlyInRecovery {
        guardianToRecovery[msg.sender] = Recovery(
            _proposedVerificationKey,
            currentVerificationKeyRecoveryRound,
            false
        );
        emit RecoverySupported(
            msg.sender,
            _proposedVerificationKey,
            currentVerificationKeyRecoveryRound
        );
    }

    /**
     * @notice Allows the guardians to cancel a wallet recovery (assuming they recovered private keys)
     * Wallet must already be in recovery mode
     */
    function cancelRecovery() external onlyGuardian onlyInRecovery {
        isVerificationKeyInRecovery = false;
        emit RecoveryCancelled(msg.sender, currentVerificationKeyRecoveryRound);
    }

    /**
     * @notice Allows a guardian to execute a wallet recovery and set a newOwner
     * Wallet must already be in recovery mode
     * @param newVerificationKey - the new owner of the wallet
     * @param guardianList - list of addresses of guardians that have voted for this newOwner
     */
    function executeRecovery(
        address newVerificationKey,
        address[] calldata guardianList
    ) external onlyGuardian onlyInRecovery {
        // Need enough guardians to agree on same newOwner
        require(
            guardianList.length >= threshold,
            "more guardians required to transfer ownership"
        );

        // Let's verify that all guardians agreed on the same newOwner in the same round
        for (uint i = 0; i < guardianList.length; i++) {
            // cache recovery struct in memory
            Recovery memory recovery = guardianToRecovery[guardianList[i]];

            require(
                recovery.recoveryRound == currentVerificationKeyRecoveryRound,
                "round mismatch"
            );
            require(
                recovery.proposedOwner == newVerificationKey,
                "disagreement on new owner"
            );
            require(
                !recovery.usedInExecuteRecovery,
                "duplicate guardian used in recovery"
            );

            // set field to true in storage, not memory
            guardianToRecovery[guardianList[i]].usedInExecuteRecovery = true;
        }

        isVerificationKeyInRecovery = false;
        address _oldVerificationKey = verificationKey;
        verificationKey = newVerificationKey;
        keyUpdateBlockNumber = block.number;
        emit RecoveryExecuted(
            _oldVerificationKey,
            newVerificationKey,
            currentVerificationKeyRecoveryRound
        );
    }

    // To relay blockhash to the adapter on gnosis - 0x32Cd442309cA6E79Db2194aac61024FBD2B14eb9
    function triggerHashRelay(
        address _headerReporter,
        address _adapter
    ) external payable {
        uint256[] memory blockNumbers;
        blockNumbers[0] = keyUpdateBlockNumber;
        IAMBHeaderReporter(_headerReporter).reportHeaders(
            blockNumbers,
            _adapter,
            100000
        );
    }

    /************************************************
     *  Guardian Management
     ***********************************************/

    /**
     * @notice Allows a guardian to transfer their guardianship
     * Cannot transfer guardianship during recovery mode
     * @param newGuardianHash - hash of the address of the new guardian
     */
    function transferGuardianship(
        bytes32 newGuardianHash
    ) external onlyGuardian notInRecovery {
        // Don't let guardian queued for removal transfer their guardianship
        require(
            guardianHashToRemovalTimestamp[
                keccak256(abi.encodePacked(msg.sender))
            ] == 0,
            "guardian queueud for removal, cannot transfer guardianship"
        );
        isGuardian[keccak256(abi.encodePacked(msg.sender))] = false;
        isGuardian[newGuardianHash] = true;
        emit GuardinshipTransferred(msg.sender, newGuardianHash);
    }

    /**
     * @notice Allows the owner to queue a guardian for removal
     * @param guardianHash - hash of the address of the guardian to queue
     */
    function initiateGuardianRemoval(
        bytes32 guardianHash
    ) external onlyVerificationKeyOwner {
        // verify that the hash actually corresponds to a guardian
        require(isGuardian[guardianHash], "not a guardian");

        // removal delay fixed at 3 days
        guardianHashToRemovalTimestamp[guardianHash] = block.timestamp + 3 days;
        emit GuardianRemovalQueued(guardianHash);
    }

    /**
     * @notice Allows the owner to remove a guardian
     * Note that the guardian must have been queued for removal prior to invocation of this function
     * @param oldGuardianHash - hash of the address of the guardian to remove
     * @param newGuardianHash - new guardian hash to replace the old guardian
     */
    function executeGuardianRemoval(
        bytes32 oldGuardianHash,
        bytes32 newGuardianHash
    ) external onlyVerificationKeyOwner {
        require(
            guardianHashToRemovalTimestamp[oldGuardianHash] > 0,
            "guardian isn't queued for removal"
        );
        require(
            guardianHashToRemovalTimestamp[oldGuardianHash] <= block.timestamp,
            "time delay has not passed"
        );

        // Reset this the removal timestamp
        guardianHashToRemovalTimestamp[oldGuardianHash] = 0;

        isGuardian[oldGuardianHash] = false;
        isGuardian[newGuardianHash] = true;
        emit GuardianRemoved(oldGuardianHash, newGuardianHash);
    }

    /**
     * @notice Allows the owner to cancel the removal of a guardian
     * @param guardianHash - hash of the address of the guardian queued for removal
     */
    function cancelGuardianRemoval(
        bytes32 guardianHash
    ) external onlyVerificationKeyOwner {
        guardianHashToRemovalTimestamp[guardianHash] = 0;
    }

    /**
     * @notice Utility function that selectively allows a guardian to reveal their identity
     * If the owner passes away, this can be used for the guardians to find each other and
     * determine a course of action
     */
    function revealGuardianIdentity() external onlyGuardian {
        emit GuardianRevealed(
            keccak256(abi.encodePacked(msg.sender)),
            msg.sender
        );
    }
}
