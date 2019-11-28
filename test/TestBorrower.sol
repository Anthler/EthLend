pragma solidity >=0.4.21 <0.6.0;

import "truffle/DeployedAddresses.sol";
import "truffle/Assert.sol";
import "../contracts/Borrower.sol";
import "./BorrowerProxy.sol";

contract TestBorrower {

    uint initialBalance = 1 ether;

    Borrower public borrower;
    Borrower public borrower2;
    BorrowerProxy public borrowerProxy;

    function beforeEach() public {
        borrower = new Borrower();
        borrower2 = new Borrower();
        borrowerProxy = new BorrowerProxy(borrower);
        borrowerProxy.init(address(borrower));
    }

    function testGetFee() public {
        uint amount = 1000;
        uint fee = borrower.getFee(1000);
        Assert.isTrue(fee == amount/100000, " Fee should be amount/100000");
    }

    function testInit() public {
        (bool success) = borrowerProxy.init(address(borrower2));
        Assert.isFalse(success, "second call of init should fail");
    }

    function testFallback() public {
        bool success = address(borrower).send(200 wei);
        Assert.isFalse(success, "Borrower should reject funds transfers from random addresses");
    }
}
