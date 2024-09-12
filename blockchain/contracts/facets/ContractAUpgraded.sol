// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {LibStorage} from "../libraries/LibStorage.sol";
import {ReentrancyGuard} from "./helper/ReentrancyGuard.sol";
import {ContractB} from "./ContractB.sol";

error Unauthorized();

contract ContractAUpgraded is ReentrancyGuard, ContractB {
    event TestEvent(address something);
    uint256[50] private __gap; // Ensure storage layout compatibility

    modifier checkIfAdmin() {
        if (hasRole(ADMIN_ROLE, msg.sender)) _;
        else revert Unauthorized();
    }

    function setValue(uint _number) external nonReentrant checkIfAdmin {
        LibStorage.ContractStorage storage s = LibStorage.getContractStorage();
        s.value = s.value + _number;
    }

    function getValue() external view checkIfAdmin returns (uint) {
        LibStorage.ContractStorage storage s = LibStorage.getContractStorage();
        return s.value;
    }
}
