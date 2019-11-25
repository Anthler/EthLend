var Token = artifacts.require("DestructableToken");
const { expectRevert } = require('@openzeppelin/test-helpers');

contract("Token deposits", async function (accounts) {
  var token;
  beforeEach(async function () {
    token = await Token.new(accounts[4]);
    var testerBalance = await web3.eth.getBalance(accounts[0]);
  });

  describe('deposit()', async function () {

    it("should not fail on not zero deposit", async function () {
      await token.deposit({
        from: accounts[0],
        value: web3.utils.toWei("1", "ether")
      })
    });

    it("should fail on zero deposits", async function () {

      await expectRevert.unspecified(token.deposit({
        from: accounts[0],value: web3.utils.toWei("0", "ether")
      }))
    });

    it("should mint amount of tokens equal to amount of eth if no earnings", async function () {
      var amountToDeposit = web3.utils.toWei("1", "ether");
      for (var i = 0; i < 10; i++) {
        await web3.eth.sendTransaction({
          from: accounts[0],
          to: accounts[1],
          value: amountToDeposit
        });

        await token.deposit({
          from: accounts[1],
          value: amountToDeposit
        })

        var amount = (await token.balanceOf(accounts[1])).toString();
        await token.transfer(accounts[0], amount, {
          from: accounts[1]
        });

        assert.equal(amount, amountToDeposit, "comparition failed for interation " + i);
      }
    })


  });

  afterEach(async function () {
    await token.destroy();
  });
});