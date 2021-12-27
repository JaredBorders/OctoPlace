# [OctoPlace](https://octoplace-jaredborders.vercel.app/) - NFT Marketplace by Octos.eth
- Supports buying and listing NFTs
- Supports both [ERC721](https://ethereum.org/en/developers/docs/standards/tokens/erc-721/) and [ERC1155](https://ethereum.org/en/developers/docs/standards/tokens/erc-1155/) token standards
- NOTICE: All NFTs on Kovan test network are for testing purposes only! I do not claim ownership and am only using those images to replicate what is seen elsewhere.
- - Proejcts used: [Divine Anarchy](https://opensea.io/collection/divineanarchy), [Humanoids](https://opensea.io/collection/thehumanoids), [RTFKTCloneXVial](https://opensea.io/collection/clonex), [MekaVerse](https://opensea.io/collection/mekaverse)
> Big fan of these in case you couldn't tell

## Frontend Improvements (Future)
- Add alert/prompt for when no browser wallet is detected
- While minting new NFT, show progress bar/indicator
- Test!!
## Quick start

The first things you need to do are cloning this repository and installing its
dependencies:

```sh
git clone https://github.com/JaredBorders/OctoPlace.git
cd OctoPlace
npm install
```

Once installed, let's run Hardhat's testing network:

```sh
npx hardhat node
```

Then, on a new terminal, go to the repository's root folder and run this to
deploy your contract:

```sh
npx hardhat run scripts/deploy.js --network localhost
```

Next, update the config.js file with the three address generated via the deploy script
```
export const marketAddress = "ADDRESS_GOES_HERE";
export const erc721TradableAddress = "ADDRESS_GOES_HERE";
export const erc1155TradableAddress = "ADDRESS_GOES_HERE";
```

Finally, we can run the frontend with:

```sh
npm run dev
```

> Note: There's [an issue in `ganache-core`](https://github.com/trufflesuite/ganache-core/issues/650) that can make the `npm install` step fail. 
>
> If you see `npm ERR! code ENOLOCAL`, try running `npm ci` instead of `npm install`.

Open [http://localhost:3000/](http://localhost:3000/) to see your Dapp. You will
need to have [Metamask](https://metamask.io) installed and listening to
`localhost 8545`.

## User Guide

You can find detailed instructions on using this repository and many tips in [its documentation](https://hardhat.org/tutorial).

- [Setting up the environment](https://hardhat.org/tutorial/1-setup/)
- [Testing with Hardhat, Mocha and Waffle](https://hardhat.org/tutorial/5-test/)
- [Setting up Metamask](https://hardhat.org/tutorial/8-frontend/#setting-up-metamask)
- [Hardhat's full documentation](https://hardhat.org/getting-started/)

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```

## What’s Included?

- [Hardhat](https://hardhat.org/): An Ethereum development task runner and testing network.
- [Mocha](https://mochajs.org/): A JavaScript test runner.
- [Chai](https://www.chaijs.com/): A JavaScript assertion library.
- [ethers.js](https://docs.ethers.io/ethers.js/html/): A JavaScript library for interacting with Ethereum.
- [Waffle](https://github.com/EthWorks/Waffle/): To have Ethereum-specific Chai assertions/mathers.

- See config.js for contract deployment addresses on Kovan network

## Troubleshooting

- `Invalid nonce` errors: if you are seeing this error on the `npx hardhat node`
  console, try resetting your Metamask account. This will reset the account's
  transaction history and also the nonce. Open Metamask, click on your account
  followed by `Settings > Advanced > Reset Account`.


