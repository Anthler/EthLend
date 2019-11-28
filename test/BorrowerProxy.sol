pragma solidity ^0.5.0;

import "truffle/DeployedAddresses.sol";
import "truffle/Assert.sol";
import "../contracts/Borrower.sol";

contract BorrowerProxy{

    Borrower public borrower;

    constructor( Borrower _target) public {borrower = _target;  }

    function() external {}

    function getTarget() public view returns(Borrower){return borrower;}

    function init( address _token) public returns(bool) {
        (bool success,) = address(borrower).call(abi.encodeWithSignature("init(address)",_token));
        return success;
    }

    function borrow( uint amount) public returns(bool) {
        (bool success,) = address(borrower).call(abi.encodeWithSignature("borrow(uint256)", amount));
        return success;
    }
}