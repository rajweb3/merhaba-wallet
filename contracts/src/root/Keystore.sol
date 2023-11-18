// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {Ownable2Step} from "oz/contracts/access/Ownable2Step.sol";
import {Create2} from "../lib/Create2.sol";
import {IBroker} from "./Broker.sol";

error WalletTypeNotSupported(bytes32 passedWalletType);

contract Keystore is Ownable2Step, Create2 {
    IBroker public broker;
    address public receiver;
    mapping(uint32 chainId => bool supported) public supportedChains;

    mapping(bytes32 walletType => address walletClone) public walletBytecodes;

    mapping(address user => bytes32 walletId) public walletIds;

    function setReceiver(address _receiver) external onlyOwner {
        receiver = _receiver;
    }

    function forceCreateWalletOnL2s(
        uint32[] calldata l2ChainIds,
        address user,
        bytes32 walletTypes,
        bytes32 walletId
    ) public {
        uint len = l2ChainIds.length;
        for (uint i; i < len; ) {
            forceCreateWalletOnL2(l2ChainIds[i], user, walletTypes, walletId);
            unchecked {
                ++i; // not needed for sol 8.22 but not all chains support push0 (8.20) yet
            }
        }
    }

    function forceCreateWalletOnL2(
        uint32 chainId,
        address user,
        bytes32 walletType,
        bytes32 walletId
    ) public {
        if (walletBytecodes[walletType] == address(0)) {
            revert WalletTypeNotSupported(walletType);
        }
        broker.sendMessage(
            chainId,
            receiver,
            abi.encode(user, walletType, walletId)
        );
    }

    function previewWalletAddress(
        address user,
        bytes32 walletType,
        bytes32 walletId
    ) public view returns (address) {
        bytes32 bytecodeHash = keccak256(
            minimalProxyCreationCode(walletBytecodes[walletType])
        );
        return
            computedCreate2Address(
                keccak256(abi.encode(user, walletId)),
                bytecodeHash,
                address(this) /*deployer*/
            );
    }

    function updateWalletType(
        bytes32 _walletType,
        address _walletClone
    ) external onlyOwner {
        walletBytecodes[_walletType] = _walletClone;
    }

    function updateSupportedChains(
        uint32 _chainId,
        bool _supported
    ) external onlyOwner {
        supportedChains[_chainId] = _supported;
    }

    function setBroker(address _broker) external onlyOwner {
        broker = IBroker(_broker);
    }

    constructor() {
        supportedChains[10200] = true; // chiado
        supportedChains[80001] = true; // mumbai
        supportedChains[100] = true; // gnosis, bc goerli => gnosis bridge lol
    }
}
