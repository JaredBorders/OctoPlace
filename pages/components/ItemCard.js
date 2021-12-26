/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useRef } from 'react';

const ItemCard = (props) => {
	const [imageHeight, setImageHeight] = useState(100);
	const imgRef = useRef();

	const marketItem = props.marketItem;

	const url = marketItem.image;
	const name = marketItem.name;
	const description = marketItem.description;
	const price = marketItem.price;

	const includeBuyButton = props.includeBuyButton;
	const buyMarketItem = props.buyMarketItem;

	useEffect(() => {
		// var img = new Image();
		// img.onload = function () {
		// 	setImageHeight(this.height);
		// 	console.log(this.height);
		// };
		// img.src = url;

		imgRef.current.addEventListener('load', () => {
			console.log(imgRef.current.clientHeight);
			setImageHeight(imgRef.current.clientHeight);
		})

	});

	return (
		<>
			<div
				className="border shadow rounded-xl overflow-hidden"
				style={{ height: `${imageHeight}` }}
			>
				<img ref={imgRef} src={url} alt={description} />
				<div className="p-4">
					<p style={{ height: '64px' }} className="text-2xl font-semibold">
						{name.slice(0, 22)}
					</p>
					<div style={{ height: '50px', overflow: 'hidden' }}>
						<p className="text-gray-400">{description.slice(0, 32)}</p>
					</div>
				</div>
				<div className="p-4 bg-gray-900">
					<p className="text-2xl mb-4 font-bold text-white">{price} ETH</p>
					{includeBuyButton ? (
						<button
							className="w-full bg-purple-500 text-white font-bold py-2 px-12 rounded"
							onClick={() => buyMarketItem(props.marketItem)}
						>
							Buy
						</button>
					) : (
						<></>
					)}
				</div>
			</div>
		</>
	);
};

export default ItemCard;
