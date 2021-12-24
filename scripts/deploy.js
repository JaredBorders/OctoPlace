// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat');

async function main() {
	// Hardhat always runs the compile task when running scripts with its command
	// line interface.
	//
	// If this script is run directly using `node` you may want to call compile
	// manually to make sure everything is compiled
	// await hre.run('compile');

	// Deploy Market.sol
	const Market = await hre.ethers.getContractFactory('Market');
	const market = await Market.deploy();

	await market.deployed();

	console.log('Market deployed to:', market.address);

	// Deploy Token.sol
	const Token = await hre.ethers.getContractFactory('Token');
	const token = await Token.deploy(market.address);

	await token.deployed();

	console.log('Token deployed to:', token.address);

	// Deploy Token1155.sol
	const Token1155 = await hre.ethers.getContractFactory('Token1155');
	const token1155 = await Token.deploy(market.address);

	await token1155.deployed();

	console.log('Token1155 deployed to:', token1155.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
