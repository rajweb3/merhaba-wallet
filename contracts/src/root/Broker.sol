// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

interface IStateSender {
    function syncState(address receiver, bytes calldata data) external;
}

error ChainIdNotSupported(uint32 chainId);

contract Broker {
    IStateSender public stateSender;
    address public stateReceiver;

    function setStateSender(address _stateSender) external {
        stateSender = IStateSender(_stateSender);
    }

    function setStateReceiver(address _stateReceiver) external {
        stateReceiver = _stateReceiver;
    }

    function sendMessage(
        uint32 chainId,
        address receiver,
        bytes calldata data
    ) external {
        if (chainId == 80001) {
            stateSender.syncState(receiver, data);
        } else revert ChainIdNotSupported(chainId);
    }
}
