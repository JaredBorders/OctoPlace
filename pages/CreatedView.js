/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { tokenAddress, marketAddress } from '../config';
import ItemCard from './components/ItemCard';
import axios from 'axios';
import Web3Modal from 'web3modal';

// Market and Token artifacts
import Market from '../src/artifacts/contracts/Market.sol/Market.json';
import Token from '../src/artifacts/contracts/Token.sol/Token.json';

const CreatedView = () => {
	const [createdNFTs, setCreatedNFTs] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		getNFTsCreatedByCaller();
	}, []);

	async function getNFTsCreatedByCaller() {
		const web3Modal = new Web3Modal();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();

		const market = new ethers.Contract(marketAddress, Market.abi, signer);

		const token = new ethers.Contract(tokenAddress, Token.abi, provider);
		const data = await market.getMarketItemsCreatedByCaller();

		const createdMarketItems = await Promise.all(
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
		setCreatedNFTs(createdMarketItems);
		setLoading(false);
	}

	return (
		<>
			{!loading && createdNFTs.length == 0 ? (
				<h1 className="px-20 py-10 text-white-500 text-3xl">
					You have not yet created any NFTs :(
				</h1>
			) : (
				<div className="flex justify-center">
					<div className="px-4" style={{ maxWidth: '1600px' }}>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
							{createdNFTs.map((marketItem, i) => (
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

export default CreatedView;
