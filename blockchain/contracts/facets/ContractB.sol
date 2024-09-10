// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {LibStorage} from "../libraries/LibStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract ContractB is AccessControl {
    bytes32 public constant SUPER_ADMIN_ROLE = keccak256("SUPER_ADMIN_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    constructor(address superAdmin) {
        _setupRole(SUPER_ADMIN_ROLE, superAdmin);
        _setRoleAdmin(ADMIN_ROLE, SUPER_ADMIN_ROLE);
    }

    function addAdmin(address account) public onlyRole(SUPER_ADMIN_ROLE) {
        grantRole(ADMIN_ROLE, account);
    }

    function removeAdmin(address account) public onlyRole(SUPER_ADMIN_ROLE) {
        revokeRole(ADMIN_ROLE, account);
    }

    function transferAdminRole(address oldAdmin, address newAdmin) public onlyRole(SUPER_ADMIN_ROLE) {
        revokeRole(ADMIN_ROLE, oldAdmin);
        grantRole(ADMIN_ROLE, newAdmin);
    }

    function renounceAdminRole() public {
        renounceRole(ADMIN_ROLE, msg.sender);
    }
}
