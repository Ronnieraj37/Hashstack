// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {LibStorage} from "../libraries/LibStorage.sol";
import {ReentrancyGuard} from "./helper/ReentrancyGuard.sol";
import {Initializable} from "./helper/Initializable.sol";
import {LibDiamond} from "../libraries/LibDiamond.sol";
error Unauthorized();

contract ContractA is ReentrancyGuard, Initializable {
    modifier checkIfAdmin() {
        if (LibDiamond.contractOwner() == msg.sender) _;
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
