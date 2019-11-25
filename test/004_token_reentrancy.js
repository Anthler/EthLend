var Token = artifacts.require("DestructableToken");
var BadActor = artifacts.require("BadActor");
var GoodActor = artifacts.require("GoodActor");
const { expectRevert } = require('@openzeppelin/test-helpers');

contract("Token reentrancy", async function (accounts) {
  var token;
  var badActor;

  beforeEach(async function () {
    token = await Token.new(accounts[4]);
    badActor = await BadActor.new(token.address);
    goodActor = await GoodActor.new(token.address);
    badActor.deposit({
      from: accounts[1],
      value: web3.utils.toWei("1.1", "ether")
    })
    goodActor.deposit({
      from: accounts[1],
      value: web3.utils.toWei("1.1", "ether")
    })
  });

  it("badActor should fail on withdraw()", async function () {
    await expectRevert.unspecified(badActor.withdraw());
  });

  it("goodActor should not fail on withdraw()", async function () {
    await goodActor.withdraw();
  });
  afterEach(async function () {
    await token.destroy();
    await badActor.destroy();
    await goodActor.destroy();
  });
});