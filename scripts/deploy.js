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

	// Deploy ERC721Tradable.sol
	const ERC721Tradable = await hre.ethers.getContractFactory('ERC721Tradable');
	const erc721Tradable = await ERC721Tradable.deploy(market.address);

	await erc721Tradable.deployed();

	console.log('erc721Tradable deployed to:', erc721Tradable.address);

	// Deploy ERC721Tradable.sol
	const ERC1155Tradable = await hre.ethers.getContractFactory(
		'ERC1155Tradable'
	);
	const erc1155Tradable = await ERC1155Tradable.deploy(market.address);

	await erc1155Tradable.deployed();

	console.log('erc1155Tradable deployed to:', erc1155Tradable.address);

	if (
		market.address != null &&
		erc721Tradable.address != null &&
		erc1155Tradable.address != null
	) {
		console.log('All contracts deployed successfully!');
	}
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
