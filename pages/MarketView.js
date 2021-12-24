/* eslint-disable @next/next/no-img-element */
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';
import { tokenAddress, marketAddress } from '../config';

// Market and Token artifacts
import Market from '../src/artifacts/contracts/Market.sol/Market.json';
import Token from '../src/artifacts/contracts/Token.sol/Token.json';

const MarketView = () => {
	const [marketItems, setMarketItems] = useState([]);
	const [loading, setLoading] = useState(false);

	// Get NFTs on page-load
	useEffect(() => {
		setLoading(true);
		getMarketItems();
	}, []);

	const getMarketItems = async () => {
		const provider = new ethers.providers.JsonRpcProvider();
		const market = new ethers.Contract(marketAddress, Market.abi, provider);
		const token = new ethers.Contract(tokenAddress, Token.abi, provider);

		const data = await market.getAllUnsoldMarketItems();

		/* market item structure:
			struct MarketItem {
				uint256 itemId;
				uint256 tokenId;
				uint256 price;
				address tokenAddress;
				address payable seller;
				address payable owner;
				bool sold;
			}
		*/

		// map through marketItems and format
		const unsoldMarketItems = await Promise.all(
			data.map(async (item) => {
				const tokenUri = await token.tokenURI(item.tokenId);
				const meta = await axios.get(tokenUri); // http://{...}
				let price = ethers.utils.formatUnits(
					item.price.toString(),
					'ether'
				);

				let newMarketItem = {
					price,
					tokenId: item.tokenId.toNumber(),
					seller: item.seller,
					owner: item.owner,
					image: meta.data.image,
					name: meta.data.name,
					description: meta.data.description,
				};

				return newMarketItem;
			})
		);

		setMarketItems(unsoldMarketItems);
		setLoading(false);
	};

	const buyMarketItem = async (marketItem) => {
		const web3Modal = new Web3Modal();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();

		const market = new ethers.Contract(marketAddress, Market.abi, signer);

		// prompt user to pay the list price
		const price = ethers.utils.parseUnits(
			marketItem.price.toString(),
			'ether'
		);
		const transaction = await market.buyMarketItem(
			tokenAddress,
			marketItem.tokenId,
			{
				value: price,
			}
		);
		await transaction.wait();
		getMarketItems();
	};

	return (
		<>
			{!loading && marketItems.length == 0 ? (
				<h1 className="px-20 py-10 text-white-500 text-3xl">No items in marketplace</h1>
			) : (
				<div className="flex justify-center">
					<div className="px-4" style={{ maxWidth: '1600px' }}>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
							{marketItems.map((marketItem, i) => (
								<div
									key={i}
									className="border shadow rounded-xl overflow-hidden"
								>
									<img
										src={marketItem.image}
										alt="Market Item Image"
									/>
									<div className="p-4">
										<p
											style={{ height: '64px' }}
											className="text-2xl font-semibold"
										>
											{marketItem.name}
										</p>
										<div
											style={{ height: '70px', overflow: 'hidden' }}
										>
											<p className="text-gray-400">
												{marketItem.description}
											</p>
										</div>
									</div>
									<div className="p-4 bg-gray-900">
										<p className="text-2xl mb-4 font-bold text-white">
											{marketItem.price} ETH
										</p>
										<button
											className="w-full bg-purple-500 text-white font-bold py-2 px-12 rounded"
											onClick={() => buyNft(nft)}
										>
											Buy
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default MarketView;
