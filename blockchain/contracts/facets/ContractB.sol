// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import {Initializable} from "./helper/Initializable.sol";
import {LibDiamond} from "../libraries/LibDiamond.sol";
error Unauthorized();

contract ContractB is AccessControl, Initializable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    address public superAdmin;

    function initializeUpgraded() external initializer {
        address _superAdmin = LibDiamond.contractOwner();
        _grantRole(DEFAULT_ADMIN_ROLE, _superAdmin);
        superAdmin = _superAdmin;
    }

    modifier checkIfAdmin() {
        if (hasRole(ADMIN_ROLE, msg.sender)) _;
        else revert Unauthorized();
    }

    // Function to add an admin
    function addAdmin(address admin) external {
        grantRole(ADMIN_ROLE, admin);
    }

    // Function to remove an admin
    function removeAdmin(address admin) external {
        revokeRole(ADMIN_ROLE, admin);
    }

    // Transfer the superadmin role to another address (including contract B)
    function transferSuperadminRole(address newSuperAdmin) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Only superadmin can transfer role");
        revokeRole(DEFAULT_ADMIN_ROLE, msg.sender);
        grantRole(DEFAULT_ADMIN_ROLE, newSuperAdmin);
    }

    function checkAdminRole(address admin) external view returns (bool) {
        return hasRole(ADMIN_ROLE, admin);
    }
}
