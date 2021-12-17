const { expect } = require("chai");

describe("Market contract", function () {
  let Market, market, owner, addr1, addr2, addrs;

  beforeEach(async function () {
    Market = await ethers.getContractFactory("Market");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    market = await Market.deploy();
    await market.deployed();
  });

  describe("Deployment", function () {
    it("Should deploy", async function () {
      expect(owner.address).to.exist;
    });
  });
});
