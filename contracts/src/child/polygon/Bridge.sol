// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

interface IPolygonBridge {
    function sendMessageToChild(bytes calldata data) external;
}

interface IStateSender {
    function syncState(address receiver, bytes calldata data) external;
}

contract PolygonBridge is IPolygonBridge {
    IStateSender public stateSender;
    address public stateReceiver;

    constructor(address _stateSender) {
        stateSender = IStateSender(_stateSender);
    }

    function setStateReceiver(address _stateReceiver) external {
        stateReceiver = _stateReceiver;
    }

    function sendMessageToChild(bytes calldata _data) public override {
        stateSender.syncState(stateReceiver, _data);
    }
}
