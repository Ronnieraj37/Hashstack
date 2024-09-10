// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library LibStorage {
    bytes32 constant CONTRACT_STORAGE_POSITION = keccak256("contract.storage");

    struct Storage {
        uint value;
        address admin;
    }

    function getStorage() internal pure returns (Storage storage ds) {
        bytes32 position = CONTRACT_STORAGE_POSITION;
        // assigns struct storage slot to the storage position
        assembly {
            ds.slot := position
        }
    }
}
