const { expect } = require("chai");

describe("Market", () => {
  let Market, market, owner, addr1, addr2, addrs;
  let Token, token;

  beforeEach(async () => {
    // deploy the market
    Market = await ethers.getContractFactory("Market");
    market = await Market.deploy();
    await market.deployed();

    // deploy ERC721Tradable token
    ERC721Tradable = await ethers.getContractFactory("ERC721Tradable");
    erc721Tradable = await ERC721Tradable.deploy(market.address);
    await erc721Tradable.deployed();

    // deploy ERC1155Tradable token
    ERC1155Tradable = await ethers.getContractFactory("ERC1155Tradable");
    erc1155Tradable = await ERC1155Tradable.deploy("", market.address);
    await erc1155Tradable.deployed();

    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
  });

  it("Should create ERC721Tradable tokens", async () => {
    // create token(s)
    await erc721Tradable.createToken("https://www.mytokenlocation.com");
    await erc721Tradable.createToken("https://www.mytokenlocation2.com");

    // establish price
    let price1 = await ethers.utils.parseUnits('1', 'ether');
    let price2 = await ethers.utils.parseUnits('2', 'ether');

    // list token(s)
    await market.createMarketItem(erc721Tradable.address, 1, price1, 
      { 
        value: price1 
      }
    );

    await market.createMarketItem(erc721Tradable.address, 2, price2, 
      { 
        value: price2 
      }
    );

    let allUnsoldMarketItems = await market.getAllUnsoldMarketItems();

    expect(allUnsoldMarketItems[0].tokenAddress).to.equal(erc721Tradable.address);
    expect(allUnsoldMarketItems[1].tokenAddress).to.equal(erc721Tradable.address);
  });

  it("Should create ERC1155Tradable tokens", async () => {
    // create token(s)
    await erc1155Tradable.create(owner.address, "https://www.mytokenlocation.com");
    await erc1155Tradable.create(owner.address, "https://www.mytokenlocation2.com");

    // establish price
    let price1 = await ethers.utils.parseUnits('1', 'ether');
    let price2 = await ethers.utils.parseUnits('2', 'ether');

    // list token(s)
    await market.createMarketItemERC1155(erc1155Tradable.address, 1, price1, 
      { 
        value: price1 
      }
    );

    await market.createMarketItemERC1155(erc1155Tradable.address, 2, price2, 
      { 
        value: price2 
      }
    );

    let allUnsoldMarketItems = await market.getAllUnsoldMarketItems();

    expect(allUnsoldMarketItems[0].tokenAddress).to.equal(erc1155Tradable.address);
    expect(allUnsoldMarketItems[1].tokenAddress).to.equal(erc1155Tradable.address);
  });

  it("Should buy/sell ERC721Tradable Tokens", async () => {
    // create token(s)
    await erc721Tradable.createToken("");
    await erc721Tradable.createToken("");

    // establish price
    let price1 = await ethers.utils.parseUnits('1', 'ether');
    let price2 = await ethers.utils.parseUnits('2', 'ether');

    // list token(s)
    await market.createMarketItem(erc721Tradable.address, 1, price1, 
      { 
        value: price1 
      }
    );

    await market.createMarketItem(erc721Tradable.address, 2, price2, 
      { 
        value: price2 
      }
    );

    // execute buy/sell
    await market.connect(addr1).buyMarketItem(
      erc721Tradable.address, 
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
    expect(erc721Tradable.address).to.equal(soldItem.tokenAddress);
    expect(owner.address).to.equal(soldItem.seller);
    expect(addr1.address).to.equal(soldItem.owner);
    expect(true).to.equal(soldItem.sold);
  });

  it("Should buy/sell ERC1155Tradable Tokens", async () => {
    // create token(s)
    await erc1155Tradable.create(owner.address, "https://www.mytokenlocation.com");
    await erc1155Tradable.create(owner.address, "https://www.mytokenlocation2.com");

    // establish price
    let price1 = await ethers.utils.parseUnits('1', 'ether');
    let price2 = await ethers.utils.parseUnits('2', 'ether');

    // list token(s)
    await market.createMarketItemERC1155(erc1155Tradable.address, 1, price1, 
      { 
        value: price1 
      }
    );

    await market.createMarketItemERC1155(erc1155Tradable.address, 2, price2, 
      { 
        value: price2 
      }
    );

    // execute buy/sell
    await market.connect(addr1).buyMarketItemERC1155(
      erc1155Tradable.address, 
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
    expect(erc1155Tradable.address).to.equal(soldItem.tokenAddress);
    expect(owner.address).to.equal(soldItem.seller);
    expect(addr1.address).to.equal(soldItem.owner);
    expect(true).to.equal(soldItem.sold);
  });

  it("Should get ERC721Tradable Tokens created by caller", async () => {
    // create token(s)
    await erc721Tradable.createToken("https://www.mytokenlocation.com");
    await erc721Tradable.createToken("https://www.mytokenlocation2.com");

    // establish price
    let price = await ethers.utils.parseUnits('1', 'ether');

    // list token(s)
    await market.createMarketItem(erc721Tradable.address, 1, price, 
      { 
        value: price 
      }
    );

    await market.createMarketItem(erc721Tradable.address, 2, price, 
      { 
        value: price 
      }
    );

    let tokensCreated = await market.getMarketItemsCreatedByCaller();
    expect(tokensCreated.length).to.equal(2);
  });

  it("Should get ERC1155Tradable Tokens created by caller", async () => {
    // create token(s)
    await erc1155Tradable.create(owner.address, "https://www.mytokenlocation.com");
    await erc1155Tradable.create(owner.address, "https://www.mytokenlocation2.com");

    // establish price
    let price1 = await ethers.utils.parseUnits('1', 'ether');
    let price2 = await ethers.utils.parseUnits('2', 'ether');

    // list token(s)
    await market.createMarketItemERC1155(erc1155Tradable.address, 1, price1, 
      { 
        value: price1 
      }
    );

    await market.createMarketItemERC1155(erc1155Tradable.address, 2, price2, 
      { 
        value: price2 
      }
    );

    let tokensCreated = await market.getMarketItemsCreatedByCaller();
    expect(tokensCreated.length).to.equal(2);
  });

  it("Should get ERC721Tradable Tokens owned by caller", async () => {
    // create token(s)
    await erc721Tradable.createToken("https://www.mytokenlocation.com");
    await erc721Tradable.createToken("https://www.mytokenlocation2.com");

    // establish price
    let price1 = await ethers.utils.parseUnits('1', 'ether');
    let price2 = await ethers.utils.parseUnits('2', 'ether');

    // list token(s)
    await market.createMarketItem(erc721Tradable.address, 1, price1, 
      { 
        value: price1 
      }
    );

    await market.createMarketItem(erc721Tradable.address, 2, price2, 
      { 
        value: price2 
      }
    );

    let tokensOwned = await market.getMarketItemsOwnedByCaller();
    expect(tokensOwned.length).to.equal(0);

    // execute buy/sell
    await market.connect(addr1).buyMarketItem(
      erc721Tradable.address, 
      1, 
      { 
        value: price1
      }
    );

    await market.connect(addr2).buyMarketItem(
      erc721Tradable.address, 
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

  it("Should get ERC1155Tradable Tokens owned by caller", async () => {
    // create token(s)
    await erc1155Tradable.create(owner.address, "https://www.mytokenlocation.com");
    await erc1155Tradable.create(owner.address, "https://www.mytokenlocation2.com");

    // establish price
    let price1 = await ethers.utils.parseUnits('1', 'ether');
    let price2 = await ethers.utils.parseUnits('2', 'ether');

    // list token(s)
    await market.createMarketItemERC1155(erc1155Tradable.address, 1, price1, 
      { 
        value: price1 
      }
    );

    await market.createMarketItemERC1155(erc1155Tradable.address, 2, price2, 
      { 
        value: price2 
      }
    );

    let tokensOwned = await market.getMarketItemsOwnedByCaller();
    expect(tokensOwned.length).to.equal(0);

    // execute buy/sell
    await market.connect(addr1).buyMarketItemERC1155(
      erc1155Tradable.address, 
      1, 
      { 
        value: price1
      }
    );

    await market.connect(addr2).buyMarketItemERC1155(
      erc1155Tradable.address, 
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