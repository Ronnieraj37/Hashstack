// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {LibStorage} from "../libraries/LibStorage.sol";
import {ReentrancyGuard} from "./helper/ReentrancyGuard.sol";
import {LibDiamond} from "../libraries/LibDiamond.sol";
error Unauthorized();

contract ContractA is ReentrancyGuard {
    uint256[50] private __gap;

    modifier checkIfOwner() {
        if (LibDiamond.contractOwner() == msg.sender) _;
        else revert Unauthorized();
    }

    function setValue(uint _number) external nonReentrant checkIfOwner {
        LibStorage.ContractStorage storage s = LibStorage.getContractStorage();
        s.value = s.value + _number;
    }

    function getValue() external view checkIfOwner returns (uint) {
        LibStorage.ContractStorage storage s = LibStorage.getContractStorage();
        return s.value;
    }
}
