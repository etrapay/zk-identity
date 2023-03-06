// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Contracts
import "./MerkleTree.sol";

// Interface
import "./interfaces/IVerifier.interface.sol";
import "hardhat/console.sol";

// Library
import {Time} from "./Time.sol";

contract ZkIdentity is MerkleTree {
    IVerifier public verifier;

    /// @dev Mapping for msg.sender => identity
    mapping(address => bytes32) public identities;

    struct Proof {
        uint256[2] a;
        uint256[2][2] b;
        uint256[2] c;
        uint256[6] input;
    }

    constructor(IHasher _hasher, IVerifier _verifier) MerkleTree(_hasher) {
        verifier = _verifier;
    }

    /// @dev Events
    event Register(
        address indexed sender,
        uint32 index,
        bytes32 leaf,
        bytes32 root,
        bytes32[DEPTH] pathElements,
        uint8[DEPTH] pathIndices
    );

    /// @dev Register identity
    function register(bytes32 identity) external {
        // require(
        //     identities[msg.sender] == bytes32(0),
        //     "ZkIdentity: Identity already exists"
        // );

        identities[msg.sender] = identity;

        (
            uint32 index,
            bytes32 leaf,
            bytes32 root,
            bytes32[DEPTH] memory pathElements,
            uint8[DEPTH] memory pathIndices
        ) = _insert(identity);

        emit Register(msg.sender, index, leaf, root, pathElements, pathIndices);
    }

    function checkAge(Proof calldata proof) external returns (bool) {
        (uint256 year, uint256 month, uint256 day) = getDate();

        require(
            uint256(identities[msg.sender]) == proof.input[0],
            "ZkIdentity: Invalid leaf"
        );

        require(
            isKnownRoot(bytes32(proof.input[4])),
            "ZkIdentity: Invalid root"
        );

        require(
            proof.input[1] == day &&
                proof.input[2] == month &&
                proof.input[3] == year,
            "ZkIdentity: Invalid date"
        );

        require(
            verifier.verifyProof(proof.a, proof.b, proof.c, proof.input),
            "ZkIdentity: Invalid proof"
        );
        return true;
    }

    function getDate()
        public
        view
        returns (
            uint256 year,
            uint256 month,
            uint256 day
        )
    {
        (year, month, day) = Time.timestampToDate(block.timestamp);
    }
}
