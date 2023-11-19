// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;
import {ReentrancyGuard} from "./ReentrancyGuard.sol";
import {AxiomV2Client} from "./AxiomV2Client.sol";
import {IERC721Receiver} from "oz/contracts/token/ERC721/IERC721Receiver.sol";
import {IERC1155Receiver} from "oz/contracts/token/ERC1155/IERC1155Receiver.sol";
import {IHashi} from "./interfaces/IHashi.sol";
import {IOracleAdapter} from "./interfaces/IOracleAdapter.sol";

contract Wallet is
    AxiomV2Client,
    ReentrancyGuard,
    IERC721Receiver,
    IERC1155Receiver
{
    /************************************************
     *  STORAGE
     ***********************************************/

    /// @notice key store contract maintaining the state of the verification key
    address public keyStoreContract;
    /// @notice verification key required for all transactions
    address public verificationKey;

    // /// @notice true if wallet is suspected to be lost
    // bool public inRecovery;

    uint64 public callbackSourceChainId;
    bytes32 public axiomCallbackQuerySchema;

    address public hashiAddress;
    address public hashiOracleAdapterAddress;

    /************************************************
     *  MODIFIERS & EVENTS
     ***********************************************/

    modifier onlyOwner() {
        require(msg.sender == verificationKey, "only owner");
        _;
    }

    /// @notice emitted when an external transaction/transfer is executed
    event TransactionExecuted(
        address indexed callee,
        uint256 value,
        bytes data
    );
    event BlockHashVerified(uint256 indexed blockNumber, bytes32 blockHash);

    /**
     * @notice Sets the key store contract address
     * @param _keyStoreContract - the keystore contract address
     */
    constructor(
        address _keyStoreContract,
        address _axiomV2QueryAddress,
        uint64 _callbackSourceChainId,
        bytes32 _axiomCallbackQuerySchema,
        address _hashiAddress,
        address _hashiOracleAdapterAddress
    ) AxiomV2Client(_axiomV2QueryAddress) {
        keyStoreContract = _keyStoreContract;
        verificationKey = msg.sender;
        callbackSourceChainId = _callbackSourceChainId;
        axiomCallbackQuerySchema = _axiomCallbackQuerySchema;
        hashiAddress = _hashiAddress;
        hashiOracleAdapterAddress = _hashiOracleAdapterAddress;
    }

    /************************************************
     *  External Transaction Execution
     ***********************************************/

    /**
     * @notice Allows owner to execute an arbitrary transaction
     * @dev to transfer ETH to an EOA, pass in empty string for data parameter
     * @param callee - contract/EOA to call/transfer to
     * @param value - value to pass to callee from wallet balance
     * @param data - data to pass to callee
     * @return result of the external call
     */

    function executeExternalTx(
        address callee,
        uint256 value,
        bytes memory data
    ) external onlyOwner nonReentrant returns (bytes memory) {
        (bool success, bytes memory result) = callee.call{value: value}(data);
        require(success, "external call reverted");
        emit TransactionExecuted(callee, value, data);
        return result;
    }

    function executeRecovery(
        address _newVerificationKey,
        uint256 _blockNumber
    ) external {
        bytes32 blockHashFromHashi = IHashi(hashiAddress).getHashFromOracle(
            IOracleAdapter(hashiOracleAdapterAddress),
            callbackSourceChainId,
            _blockNumber
        );
        emit BlockHashVerified(_blockNumber, blockHashFromHashi);
        verificationKey = _newVerificationKey;
    }

    function _axiomV2Callback(
        uint64 sourceChainId,
        address callerAddr,
        bytes32 querySchema,
        uint256 queryId,
        bytes32[] calldata axiomResults,
        bytes calldata extraData
    ) internal virtual override {
        // Parse results
        address _verificationKey = address(uint160(uint256(axiomResults[0])));
        uint32 blockNumber = uint32(uint256(axiomResults[1]));
        bytes32 blockHash = axiomResults[2];

        bytes32 blockHashFromHashi = IHashi(hashiAddress).getHashFromOracle(
            IOracleAdapter(hashiOracleAdapterAddress),
            callbackSourceChainId,
            blockNumber
        );
        require(
            blockHashFromHashi == blockHash,
            "Could not cross verify block hash."
        );
        emit BlockHashVerified(blockNumber, blockHashFromHashi);

        verificationKey = _verificationKey;
    }

    function _validateAxiomV2Call(
        uint64 sourceChainId,
        address callerAddr,
        bytes32 querySchema
    ) internal virtual override {
        require(
            sourceChainId == callbackSourceChainId,
            "AxiomV2: caller sourceChainId mismatch"
        );
        require(
            querySchema == axiomCallbackQuerySchema,
            "AxiomV2: query schema mismatch"
        );
    }

    /************************************************
     *  Receiver Standards
     ***********************************************/

    /**
     * @inheritdoc IERC721Receiver
     */
    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    /**
     * @inheritdoc IERC1155Receiver
     */
    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    /**
     * @inheritdoc IERC1155Receiver
     */
    function onERC1155BatchReceived(
        address,
        address,
        uint256[] calldata,
        uint256[] calldata,
        bytes calldata
    ) external pure returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    /**
     * @dev Support for EIP 165
     * not really sure if anyone uses this though...
     */
    function supportsInterface(
        bytes4 interfaceId
    ) external pure returns (bool) {
        if (
            interfaceId == 0x01ffc9a7 || // ERC165 interfaceID
            interfaceId == 0x150b7a02 || // ERC721TokenReceiver interfaceID
            interfaceId == 0x4e2312e0 // ERC1155TokenReceiver interfaceID
        ) {
            return true;
        }
        return false;
    }

    fallback() external payable {}

    receive() external payable {}
}
