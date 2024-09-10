// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {LibStorage} from "../libraries/LibStorage.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ContractA is ReentrancyGuard {
    event TestEvent(address something);

    function getValue() external pure nonReentrant returns (LibStorage.Storage memory) {
        LibStorage.Storage storage s = LibStorage.getStorage();
        return s;
    }

    function setValue(uint _number) external nonReentrant {
        LibStorage.Storage storage s = LibStorage.getStorage();
        s.value = s.value + _number;
    }
}
