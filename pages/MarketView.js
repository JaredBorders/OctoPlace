/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import {
	marketAddress,
	erc721TradableAddress,
	erc1155TradableAddress,
} from '../config';
import ItemCard from './components/ItemCard';
import axios from 'axios';
import Web3Modal from 'web3modal';

// Market and Tradable token artifacts
import Market from '../src/artifacts/contracts/Market.sol/Market.json';
import ERC721Tradable from '../src/artifacts/contracts/ERC721Tradable.sol/ERC721Tradable.json';
import ERC1155Tradable from '../src/artifacts/contracts/ERC1155Tradable.sol/ERC1155Tradable.json';

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
		
		// Fetch ERC721 NFTs which have not yet been sold/bought
		const data = await market.getAllUnsoldMarketItems();
		const erc721Tradable = new ethers.Contract(
			erc721TradableAddress,
			ERC721Tradable.abi,
			provider
		);
		const unsoldMarketItems = await Promise.all(
			data.map(async (item) => {
				const tokenUri = await erc721Tradable.tokenURI(item.tokenId);
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
					isERC1155: item.isERC1155,
				};

				return newMarketItem;
			})
		);

		// Fetch ERC1155 NFTs which have not yet been sold/bought
		data = await market.getAllUnsoldMarketItemsERC1155();
		const erc1155Tradable = new ethers.Contract(
			erc1155TradableAddress,
			ERC1155Tradable.abi,
			provider
		);
		const unsoldMarketItems1155 = await Promise.all(
			data.map(async (item) => {
				const tokenUri = await erc1155Tradable.getItemUriById(item.tokenId);
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
					isERC1155: item.isERC1155,
				};

				return newMarketItem;
			})
		);

		unsoldMarketItems1155.length != 0
			? setMarketItems(...unsoldMarketItems, unsoldMarketItems1155)
			: setMarketItems(unsoldMarketItems);
			
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

		if (marketItem.isERC1155) {
			const transaction = await market.buyMarketItemERC1155(
				erc1155TradableAddress,
				marketItem.tokenId,
				{
					value: price,
				}
			);
			await transaction.wait();
		} else {
			const transaction = await market.buyMarketItem(
				erc721TradableAddress,
				marketItem.tokenId,
				{
					value: price,
				}
			);
			await transaction.wait();
		}

		getMarketItems();
	};

	return (
		<>
			{!loading && marketItems.length == 0 ? (
				<h1 className="px-20 py-10 text-white-500 text-3xl">
					No items in marketplace
				</h1>
			) : (
				<div className="flex justify-center">
					<div className="px-4" style={{ maxWidth: '1600px' }}>
						<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
							{marketItems.map((marketItem, i) => (
								<div key={i} className="row-span-3">
									<ItemCard
										marketItem={marketItem}
										includeBuyButton={true}
										buyMarketItem={buyMarketItem}
									/>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default MarketView;
