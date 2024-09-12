// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import {Initializable} from "./helper/Initializable.sol";
import {LibStorage} from "../libraries/LibStorage.sol";
error Unauthorized();

contract ContractB is Initializable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;
    address public superAdmin;

    // Override initialize function to use shared storage
    function initialize() external initializer {
        LibStorage.AccessStorage storage s = LibStorage.getAccessStorage();
        superAdmin = msg.sender;
        s.adminRoles[ADMIN_ROLE] = DEFAULT_ADMIN_ROLE; // Setting admin roles
        s.roles[DEFAULT_ADMIN_ROLE][msg.sender] = true; // Grant super admin role
        s.roles[ADMIN_ROLE][msg.sender] = true; // Grant admin role to super admin
    }

    function grantRole(bytes32 role, address account) public {
        LibStorage.AccessStorage storage s = LibStorage.getAccessStorage();
        require(hasRole(s.adminRoles[role], msg.sender), "Access denied: not an admin");
        s.roles[role][account] = true;
    }

    function revokeRole(bytes32 role, address account) public {
        LibStorage.AccessStorage storage s = LibStorage.getAccessStorage();
        require(hasRole(s.adminRoles[role], msg.sender), "Access denied: not an admin");
        s.roles[role][account] = false;
    }

    function hasRole(bytes32 role, address account) public view returns (bool) {
        LibStorage.AccessStorage storage s = LibStorage.getAccessStorage();
        return s.roles[role][account];
    }

    function checkAdminRole(address admin) external view returns (bool) {
        return hasRole(ADMIN_ROLE, admin);
    }

    // Transfer the superadmin role to another address (including contract B)
    function transferSuperadminRole(address newSuperAdmin) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Only superadmin can transfer role");
        revokeRole(DEFAULT_ADMIN_ROLE, msg.sender);
        grantRole(DEFAULT_ADMIN_ROLE, newSuperAdmin);
    }
}
