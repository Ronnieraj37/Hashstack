// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.9.0) (proxy/utils/Initializable.sol)

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/utils/Address.sol";

error Already_Initialized();

abstract contract Initializable {
    bool initialized;

    modifier initializer() {
        if (initialized) revert Already_Initialized();
        initialized = true;
        _;
    }
}
