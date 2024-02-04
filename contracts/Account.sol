//SPDX-License-Identifier:MIT

pragma solidity ^0.8.19;

import "@account-abstraction/contracts/core/EntryPoint.sol";
import "@account-abstraction/contracts/interfaces/IAccount.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Create2.sol";

// contract Test{
//     constructor(bytes memory _signature){
//     address recovered=ECDSA.recover(ECDSA.toEthSignedMessageHash(keccak256("wee")),_signature);
//     console.log(recovered);
//     }
// }

contract Account is IAccount{

    address public owner;
    uint256 public count;

    constructor(address _owner){
        owner=_owner;
    }

    function validateUserOp(UserOperation calldata userOp, bytes32 userOpHash , uint256 )
    external view returns (uint256 validationData){
        address recovered=ECDSA.recover(ECDSA.toEthSignedMessageHash(userOpHash),userOp.signature);
        return owner==recovered ? 0 : 1;
        // return 0;
    }
    function execute()external{
        console.log("executed...");
        count++;
    }
}

contract AccountFactory{
    function createAccount(address _owner)public returns(address){
        // Account newAccount=new Account(_owner);
        // return address(newAccount);
        bytes32  salt=bytes32(uint256(uint160(_owner)));
        bytes memory bytecode=abi.encodePacked(type(Account).creationCode,abi.encode(_owner));

        address cfAddr=Create2.computeAddress(salt,keccak256(bytecode));

        if(cfAddr.code.length > 0){
            return cfAddr;
        }

        return deploy(salt,bytecode);
    }
    function deploy( bytes32 salt, bytes memory bytecode) internal returns (address addr) {
        require(bytecode.length != 0, "Create2: bytecode length is zero");
        /// @solidity memory-safe-assembly
        assembly {
            addr := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
        }
        require(addr != address(0), "Create2: Failed on deploy");
    }
}