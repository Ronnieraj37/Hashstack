// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library LibStorage {
    bytes32 constant CONTRACT_STORAGE_POSITION = keccak256("diamond.contract.storage");

    struct ContractStorage {
        uint value;
    }

    function getContractStorage() internal pure returns (ContractStorage storage ds) {
        bytes32 position = CONTRACT_STORAGE_POSITION;
        // assigns struct storage slot to the storage position
        assembly {
            ds.slot := position
        }
    }

    struct AccessStorage {
        // Storage for value (from ContractA/ContractAUpgraded)
        uint256 value;
        // Storage for AccessControl roles (from ContractB)
        mapping(bytes32 => mapping(address => bool)) roles;
        mapping(bytes32 => bytes32) adminRoles;
    }

    // Returns the storage pointer to be used by all facets
    function getAccessStorage() internal pure returns (AccessStorage storage s) {
        // Solidity assembly to define a unique storage slot
        bytes32 position = keccak256("diamond.access.storage");
        assembly {
            s.slot := position
        }
    }
}
