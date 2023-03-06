// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Interfaces
import "./interfaces/IHasher.interface.sol";

// @title Merkle Tree
contract MerkleTree {
    // @dev Merkle Tree depth (max number of leaves) is 2^DEPTH = 1024
    uint8 constant DEPTH = 10;
    // @dev Hasher contract for Poseidon hash implementation
    IHasher public hasher;
    // @dev Zero values for each level of merkle tree
    bytes32[] public zeros;
    // @dev Mapping for storing subtrees
    mapping(uint256 => bytes32) public filledSubtrees;
    // @dev Mapping for checking is root exist at any time
    mapping(bytes32 => bool) internal roots;
    // @dev Index for next left, insert to the merkle tree
    uint32 public nextTreeIndex;
    // @dev Current root
    bytes32 public currentRoot;
    // @dev Zero value for poseidon hash
    uint256 public constant ZERO_VALUE =
        21663839004416932945382355908790599225266501822907911457504978515578255421292;

    constructor(IHasher _hasher) {
        hasher = _hasher;
        // @dev Calculate zero values for each level of merkle tree

        bytes32 currentZero = bytes32(ZERO_VALUE);
        zeros.push(currentZero);
        filledSubtrees[0] = currentZero;

        for (uint32 i = 1; i < DEPTH; i++) {
            currentZero = hashLeftRight(currentZero, currentZero);
            zeros.push(currentZero);
            filledSubtrees[i] = currentZero;
        }

        bytes32 _root = hashLeftRight(currentZero, currentZero);
        currentRoot = _root;
        roots[_root] = true;
    }

    /// @dev Implement Poseidon hashing for 2 tree leaves @returns Poseidon(_left, _right)
    function hashLeftRight(bytes32 _left, bytes32 _right)
        public
        view
        returns (bytes32)
    {
        bytes32[2] memory leftright = [_left, _right];
        return hasher.poseidon(leftright);
    }

    // @dev Insert leaf to the merkle tree and return new root
    // @param _leaf - leaf for insert
    function _insert(bytes32 _leaf)
        internal
        returns (
            uint32 index,
            bytes32 leaf,
            bytes32 root,
            bytes32[DEPTH] memory pathElements,
            uint8[DEPTH] memory pathIndices
        )
    {
        uint32 _nextIndex = nextTreeIndex;
        require(_nextIndex != uint32(2)**DEPTH);

        uint32 currentIndex = _nextIndex;
        bytes32 currentLevelHash = _leaf;

        bytes32 left;
        bytes32 right;

        for (uint32 i = 0; i < DEPTH; i++) {
            if (currentIndex % 2 == 0) {
                left = currentLevelHash;
                right = zeros[i];
                filledSubtrees[i] = currentLevelHash;
                pathElements[i] = right;
                pathIndices[i] = 0;
            } else {
                left = filledSubtrees[i];
                right = currentLevelHash;
                pathElements[i] = left;
                pathIndices[i] = 1;
            }

            currentLevelHash = hashLeftRight(left, right);
            currentIndex /= 2;
        }

        nextTreeIndex = _nextIndex + 1;
        roots[currentLevelHash] = true;
        currentRoot = currentLevelHash;

        return (
            nextTreeIndex,
            _leaf,
            currentLevelHash,
            pathElements,
            pathIndices
        );
    }

    /// @dev Getter function for root existance
    function isKnownRoot(bytes32 _root) public view returns (bool) {
        return roots[_root];
    }

    /// @dev Getter function for current root
    function getLastRoot() public view returns (bytes32) {
        return currentRoot;
    }
}
