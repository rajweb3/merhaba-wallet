// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {Create2} from "../lib/Create2.sol";

contract WalletDeployerChild is Create2 {
    mapping(bytes32 walletType => address walletClone) public walletBytecodes;

    function updateWalletType(
        bytes32 _walletType,
        address _walletClone
    ) external {
        walletBytecodes[_walletType] = _walletClone;
    }

    // for polygon, will have different interface for other chains
    function onStateReceive(uint256, bytes calldata _data) external {
        // require(msg.sender == address(0x0000000000000000000000000000000000001001), "Invalid sender"); // comment during testing
        (, , bytes32 walletType, bytes32 salt) = abi.decode(
            _data,
            (address, uint256, bytes32, bytes32) // address, chainId, walletType, salt
        );

        bytes32 bytecodeHash = keccak256(
            minimalProxyCreationCode(walletBytecodes[walletType])
        );
        address walletAddress = computedCreate2Address(
            salt,
            bytecodeHash,
            address(this) /*deployer*/
        );
        if (walletAddress.code.length == 0) {
            createClone(salt, walletBytecodes[walletType]);
        }
    }
}
