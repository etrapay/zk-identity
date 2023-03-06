// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title IHasher Interface
/// @notice An interface for use MiMC
/// @dev Contract will be generated in `circomlib/src/mimcsponge_gencontract.js`
interface IHasher {
    function poseidon(bytes32[2] calldata leftRight)
        external
        pure
        returns (bytes32);
}
