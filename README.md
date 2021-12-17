# OctoPlace - NFT Marketplace by Octos.eth
- Supports buying and listing NFTs
- Supports both [ERC721](https://ethereum.org/en/developers/docs/standards/tokens/erc-721/) and [ERC1155](https://ethereum.org/en/developers/docs/standards/tokens/erc-1155/) standards
- (future) Interact with NFTs listed on OpenSea (https://docs.opensea.io/reference/api-overview)

## Quick start

The first things you need to do are cloning this repository and installing its
dependencies:

```sh
git clone 
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

Finally, we can run the frontend with:

```sh
cd frontend
npm install
npm start
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

## What’s Included?

- [Hardhat](https://hardhat.org/): An Ethereum development task runner and testing network.
- [Mocha](https://mochajs.org/): A JavaScript test runner.
- [Chai](https://www.chaijs.com/): A JavaScript assertion library.
- [ethers.js](https://docs.ethers.io/ethers.js/html/): A JavaScript library for interacting with Ethereum.
- [Waffle](https://github.com/EthWorks/Waffle/): To have Ethereum-specific Chai assertions/mathers.

## Troubleshooting

- `Invalid nonce` errors: if you are seeing this error on the `npx hardhat node`
  console, try resetting your Metamask account. This will reset the account's
  transaction history and also the nonce. Open Metamask, click on your account
  followed by `Settings > Advanced > Reset Account`.
