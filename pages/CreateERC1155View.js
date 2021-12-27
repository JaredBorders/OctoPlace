/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import { ethers } from 'ethers';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useRouter } from 'next/router';
import { marketAddress, erc1155TradableAddress } from '../config';
import Web3Modal from 'web3modal';

// Market and Tradable token artifacts
import Market from '../src/artifacts/contracts/Market.sol/Market.json';
import ERC1155Tradable from '../src/artifacts/contracts/ERC1155Tradable.sol/ERC1155Tradable.json';

// sets and pins items to ipfs
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const CreateERC1155View = () => {
	const [imageUrl, setImageUrl] = useState(null);
	const [formInput, updateFormInput] = useState({
		price: '',
		name: '',
		description: '',
	});
	const router = useRouter();

	// Executes when image is uploaded && sets imageUrl to ipfs location
	// (imageUrl will be used in contract to locate actual image)
	const uploadImageToIPFS = async (e) => {
		const file = e.target.files[0];
		try {
			const added = await client.add(file, {
				progress: (prog) => console.log(`received: ${prog}`),
			});
			const url = `https://ipfs.infura.io/ipfs/${added.path}`;
			setImageUrl(url);
		} catch (error) {
			console.log('Error uploading file: ', error);
		}
	};

	// Define new object (NFT) and upload to ipfs
	const createNFT = async () => {
		const { name, description, price } = formInput;

		// error logging (update)
		if (!name || !description || !price || !imageUrl) {
			if (!name) console.log('name missing');
			if (!description) console.log('description missing');
			if (!price) console.log('price missing');
			if (!imageUrl) console.log('imageUrl missing');
			return;
		}

		try {
			const added = await client.add(
				JSON.stringify({
					name,
					description,
					image: imageUrl,
				})
			);
			const url = `https://ipfs.infura.io/ipfs/${added.path}`;

			/**
			 * Connect to user's wallet, create new Token via the ERC1155Tradable contract,
			 * pointing to url on IPFS (image) and add new token's:
			 * address, id and price to the Market contract
			 */
			const web3Modal = new Web3Modal();
			const connection = await web3Modal.connect();
			const provider = new ethers.providers.Web3Provider(connection);
			const signer = provider.getSigner();

			// create ERC1155Tradable token via ERC1155Tradable contract
			let erc1155Tradable = new ethers.Contract(
				erc1155TradableAddress,
				ERC1155Tradable.abi,
				signer
			);
			let transaction = await erc1155Tradable.create(marketAddress, url);
			let tx = await transaction.wait();

			let event = tx.events[0];
			let tokenId = event.args[1].toNumber();

			// add token information to market (i.e. create a new market item)
			let market = new ethers.Contract(marketAddress, Market.abi, signer);
			transaction = await market.createMarketItemERC1155(
				erc1155TradableAddress,
				tokenId,
				ethers.utils.parseUnits(formInput.price, 'ether')
			);

			await transaction.wait();
			router.push('/');
		} catch (error) {
			console.log('Error creating/uploading NFT: ', error);
		}
	};

	return (
		<div className="flex justify-center">
			<div className="w-1/2 flex flex-col pb-12">
				<div className="flex mt-4 justify-center">
					<p className="text-3xl justify-center">
						Mint NFT (ERC1155)
					</p>
				</div>
				<input
					placeholder="Asset Name (22 characters max)"
					className="mt-8 border rounded p-4"
					maxLength="32"
					onChange={(e) =>
						updateFormInput({ ...formInput, name: e.target.value })
					}
				/>
				<textarea
					placeholder="Asset Description (32 characters max)"
					className="mt-2 border rounded p-4"
					maxLength="32"
					onChange={(e) =>
						updateFormInput({ ...formInput, description: e.target.value })
					}
				/>
				<input
					placeholder="Asset Price in Eth"
					className="mt-2 border rounded p-4"
					onChange={(e) =>
						updateFormInput({ ...formInput, price: e.target.value })
					}
				/>
				<input
					type="file"
					name="Asset"
					className="my-4"
					onChange={uploadImageToIPFS}
				/>
				{imageUrl && (
					<img
						className="rounded mt-4"
						width="350"
						src={imageUrl}
						alt="Market Item Image"
					/>
				)}
				<button
					onClick={createNFT}
					className="font-bold mt-4 bg-purple-500 text-white rounded p-4 shadow-lg"
				>
					Create Digital Asset
				</button>
			</div>
		</div>
	);
};

export default CreateERC1155View;
