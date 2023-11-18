// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

interface IBroker {
    function sendMessage(
        uint32 chainId,
        address receiver,
        bytes calldata data
    ) external;
}

interface IStateSender {
    function syncState(address receiver, bytes calldata data) external;
}

interface IAMB {
    function requireToPassMessage(
        address receiver,
        bytes calldata data,
        uint256 gas
    ) external;
}

error ChainIdNotSupported(uint32 chainId);

contract Broker is IBroker {
    // polygon
    IStateSender public stateSender;
    address public stateReceiver;

    // gnosis
    IAMB public amb;

    function setStateSender(address _stateSender) external {
        stateSender = IStateSender(_stateSender);
    }

    function setStateReceiver(address _stateReceiver) external {
        stateReceiver = _stateReceiver;
    }

    function setAMB(address _amb) external {
        amb = IAMB(_amb);
    }

    function sendMessage(
        uint32 chainId,
        address receiver,
        bytes calldata data
    ) external {
        if (chainId == 80001) stateSender.syncState(receiver, data);
        else if (chainId == 100)
            amb.requireToPassMessage(receiver, data, gasleft());
        else revert ChainIdNotSupported(chainId);
    }
}
