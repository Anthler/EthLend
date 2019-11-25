var Token = artifacts.require("DestructableToken");
const {BN, expectRevert } = require('@openzeppelin/test-helpers');

contract("Token withdraw", async function (accounts) {
  var token;
  beforeEach(async function () {
    token = await Token.new(accounts[4]);
    var testerBalance = await web3.eth.getBalance(accounts[0]);
  });
  describe("withdraw()", async function () {
    var amountToDeposit = web3.utils.toWei("1", "ether");
    var amountToDeposit2 = web3.utils.toWei("1.3", "ether");
    beforeEach(async function () {

      await token.deposit({
        from: accounts[1],
        value: amountToDeposit2
      })

      await token.deposit({
        from: accounts[2],
        value: amountToDeposit
      })

    })

    it("should allow withdraw of all tokens user deposited", async function () {
      await token.withdraw(amountToDeposit, {
        from: accounts[2]
      });

    });
    it("should deny withdraw of more funds than user have", async function () {

      await expectRevert.unspecified(token.withdraw("1000000000000000001", {
        from: accounts[2]
      }), "Should not widthraw more than what you have")
    });

    it("should return all deposited funds to the user", async function () {
      var balanceBefore = new BN(await web3.eth.getBalance(accounts[2]));

      var withdrawReciept = await token.withdraw(amountToDeposit, {
        from: accounts[2]
      });

      var withdrawTx = await web3.eth.getTransaction(withdrawReciept.tx);
      var withdrawTxCost = Number(withdrawTx.gasPrice) * withdrawReciept.receipt.gasUsed;

      var balanceAfter = new BN(await web3.eth.getBalance(accounts[2]));
      var balanceDifference = balanceAfter.sub(balanceBefore).add(new BN(withdrawTxCost));

      assert.equal(balanceDifference.toString(), amountToDeposit.toString())
    })
  })

  afterEach(async function () {
    await token.destroy();
  });
});