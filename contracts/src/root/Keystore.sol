// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {Ownable2Step} from "oz/contracts/access/Ownable2Step.sol";

contract Keystore is Ownable2Step {
    mapping(uint32 chainId => bool supported) public supportedChains;

    mapping(bytes32 walletType => address walletClone) public walletBytecodes;

    function updateWalletType(
        bytes32 _walletType,
        address _walletClone
    ) external onlyOwner {
        walletBytecodes[_walletType] = _walletClone;
    }

    function updateSupportedChains(
        uint32 _chaindId,
        bool _supported
    ) external onlyOwner {
        supportedChains[_chainId] = _supported;
    }

    constructor() {
        supportedChains[10200] = true; // chiado
        supportedChains[80001] = true; // mumbai
        supportedChains[100] = true; // gnosis, bc goerli => gnosis bridge lol
    }
}
