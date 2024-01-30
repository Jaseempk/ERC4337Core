//SPDX-License-Identifier:MIT

pragma solidity ^0.8.19;

import "@account-abstraction/contracts/core/EntryPoint.sol";
import "@account-abstraction/contracts/interfaces/IAccount.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "hardhat/console.sol";

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

    function validateUserOp(UserOperation calldata userOp, bytes32 , uint256 )
    external view returns (uint256 validationData){
        address recovered=ECDSA.recover(keccak256(bytes("wee")),userOp.signature);
        return owner==recovered ? 0 : 1;
        // return 0;
    }
    function execute()external{
        count++;
    }
}

contract AccountFactory{
    function createAccount(address _owner)public returns(address){
        Account newAccount=new Account(_owner);
        return address(newAccount);
    }
}