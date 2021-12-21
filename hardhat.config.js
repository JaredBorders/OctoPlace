require('dotenv').config();
require("@nomiclabs/hardhat-waffle");

task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: "0.8.0",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    kovan: {
      url: `${process.env.ALCHEMY_KOVAN_NODE}`,
      accounts: [`${process.env.PRIVATE_KEY}`] // Create a .env file in the root directory. Add your PRIVATE_KEY
    },
  }
};