const { expect } = require("chai");

describe("Market", () => {
  let Market, market, owner, addr1, addr2, addrs;
  let Token, token;

  beforeEach(async () => {
    // deploy the market
    Market = await ethers.getContractFactory("Market");
    market = await Market.deploy();
    await market.deployed();

    // deploy token
    Token = await ethers.getContractFactory("Token");
    token = await Token.deploy(market.address);
    await token.deployed();

    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
  });

  it("Should create Tokens", async () => {
    // create token(s)
    await token.createToken("https://www.mytokenlocation.com");
    await token.createToken("https://www.mytokenlocation2.com");

    // establish price
    let price1 = await ethers.utils.parseUnits('1', 'ether');
    let price2 = await ethers.utils.parseUnits('2', 'ether');

    // list token(s)
    await market.createMarketItem(token.address, 1, price1, 
      { 
        value: price1 
      }
    );

    await market.createMarketItem(token.address, 2, price2, 
      { 
        value: price2 
      }
    );

    let allUnsoldMarketItems = await market.getAllUnsoldMarketItems();

    expect(allUnsoldMarketItems[0].tokenAddress).to.equal(token.address);
    expect(allUnsoldMarketItems[1].tokenAddress).to.equal(token.address);
  });

  it("Should buy/sell Tokens", async () => {
    // create token(s)
    await token.createToken("");
    await token.createToken("");

    // establish price
    let price1 = await ethers.utils.parseUnits('1', 'ether');
    let price2 = await ethers.utils.parseUnits('2', 'ether');

    // list token(s)
    await market.createMarketItem(token.address, 1, price1, 
      { 
        value: price1 
      }
    );

    await market.createMarketItem(token.address, 2, price2, 
      { 
        value: price2 
      }
    );

    // execute buy/sell
    await market.connect(addr1).buyMarketItem(
      token.address, 
      1, 
      { 
        value: price1
      }
    );

    let allUnsoldMarketItems = await market.getAllUnsoldMarketItems();
    // 1 item sold, 1 has not
    expect(1).to.equal(allUnsoldMarketItems.length);
    
    // item with id of `1` was bought
    expect(allUnsoldMarketItems[0].itemId).to.equal(2);

    // get item that was sold
    let soldItem = await market.getMarketItemByItemId(1);
    expect(1).to.equal(soldItem.itemId);
    expect(1).to.equal(soldItem.tokenId);
    expect(price1).to.equal(soldItem.price);
    expect(token.address).to.equal(soldItem.tokenAddress);
    expect(owner.address).to.equal(soldItem.seller);
    expect(addr1.address).to.equal(soldItem.owner);
    expect(true).to.equal(soldItem.sold);
  });

  it("Should get Tokens created by caller", async () => {
    // create token(s)
    await token.createToken("https://www.mytokenlocation.com");
    await token.createToken("https://www.mytokenlocation2.com");

    // establish price
    let price = await ethers.utils.parseUnits('1', 'ether');

    // list token(s)
    await market.createMarketItem(token.address, 1, price, 
      { 
        value: price 
      }
    );

    await market.createMarketItem(token.address, 2, price, 
      { 
        value: price 
      }
    );

    let tokensCreated = await market.getMarketItemsCreatedByCaller();
    expect(tokensCreated.length).to.equal(2);
  });

  it("Should get Tokens owned by caller", async () => {
    // create token(s)
    await token.createToken("https://www.mytokenlocation.com");
    await token.createToken("https://www.mytokenlocation2.com");

    // establish price
    let price1 = await ethers.utils.parseUnits('1', 'ether');
    let price2 = await ethers.utils.parseUnits('2', 'ether');

    // list token(s)
    await market.createMarketItem(token.address, 1, price1, 
      { 
        value: price1 
      }
    );

    await market.createMarketItem(token.address, 2, price2, 
      { 
        value: price2 
      }
    );

    let tokensOwned = await market.getMarketItemsOwnedByCaller();
    expect(tokensOwned.length).to.equal(0);

    // execute buy/sell
    await market.connect(addr1).buyMarketItem(
      token.address, 
      1, 
      { 
        value: price1
      }
    );

    await market.connect(addr2).buyMarketItem(
      token.address, 
      2, 
      { 
        value: price2
      }
    );

    let tokensOwnedByAddr1 = await market.connect(addr1).getMarketItemsOwnedByCaller();
    expect(tokensOwnedByAddr1.length).to.equal(1);

    let tokensOwnedByAddr2 = await market.connect(addr2).getMarketItemsOwnedByCaller();
    expect(tokensOwnedByAddr2.length).to.equal(1);
  });
});