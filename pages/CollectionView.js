/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from 'react';
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

const CollectionView = () => {
	const [ownedNFTs, setOwnedNFTs] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		getNFTsOwnedByCaller();
	}, []);

	async function getNFTsOwnedByCaller() {
		const web3Modal = new Web3Modal();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();

		const market = new ethers.Contract(marketAddress, Market.abi, signer);

		// Fetch ERC721 NFTs owned by caller
		const data = await market.getMarketItemsOwnedByCaller();
		const erc721Tradable = new ethers.Contract(
			erc721TradableAddress,
			ERC721Tradable.abi,
			provider
		);
		const ownedMarketItems = await Promise.all(
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

		// Fetch ERC1155 NFTs owned by caller
		data = await market.getMarketItemsOwnedByCallerERC1155();
		const erc1155Tradable = new ethers.Contract(
			erc1155TradableAddress,
			ERC1155Tradable.abi,
			provider
		);
		const ownedMarketItemsERC1155 = await Promise.all(
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

		setOwnedNFTs(...ownedMarketItems, ownedMarketItemsERC1155);
		setLoading(false);
	}

	return (
		<>
			{!loading && ownedNFTs.length == 0 ? (
				<h1 className="px-20 py-10 text-white-500 text-3xl">
					Your collection is empty :(
				</h1>
			) : (
				<div className="flex justify-center">
					<div className="px-4" style={{ maxWidth: '1600px' }}>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
							{ownedNFTs.map((marketItem, i) => (
								<div key={i}>
									<ItemCard
										key={i}
										marketItem={marketItem}
										includeBuyButton={false}
										buyMarketItem={() => {}}
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

export default CollectionView;
