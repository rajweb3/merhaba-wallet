// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.8.11;

interface IAMBHeaderReporter {
    /// @dev Reports the given block headers to the oracleAdapter via the AMB.
    /// @param blockNumbers Uint256 array of block number to pass over the AMB.
    /// @param ambAdapter Address of the oracle adapter to pass the header to over the AMB.
    /// @param receipt Bytes32 receipt for the transaction.
    function reportHeaders(
        uint256[] memory blockNumbers,
        address ambAdapter,
        uint256 gas
    ) external returns (bytes32 receipt);
}
