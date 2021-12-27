import { useEffect, useState } from 'react';
import '../styles/globals.css';
import { ThemeProvider } from 'next-themes';
import Link from 'next/link';

function MyApp({ Component, pageProps }) {
	const [isActive, setActive] = useState([true, false, false, false, false]);

	useEffect(() => {
		setActive([true, false, false, false, false]);
	}, []);

	const toggleClass = (i) => {
		let newIsActive = [false, false, false, false, false];
		newIsActive[i] = true;
		setActive(newIsActive);
	};

	const bottomBorderClass = 'border-b border-gray-500';

	return (
		<ThemeProvider attribute="class">
			<div>
				<nav className={`${bottomBorderClass} p-8`}>
					<div className="flex mt-4 justify-center">
						<p className="text-6xl font-bold justify-center">OctoPlace</p>
					</div>
					<div className="flex mt-8 justify-center">
						<Link href="/">
							<a
								className={`${
									isActive[0] ? bottomBorderClass : ''
								} mr-8 text-purple-500 gap-4`}
								onClick={() => {
									toggleClass(0);
								}}
							>
								Market
							</a>
						</Link>
						<Link href="/CreateView">
							<a
								className={`${
									isActive[1] ? bottomBorderClass : ''
								} mr-8 text-purple-500 gap-4`}
								onClick={() => {
									toggleClass(1);
								}}
							>
								Mint
							</a>
						</Link>
						<Link href="/CreateERC1155View">
							<a
								className={`${
									isActive[2] ? bottomBorderClass : ''
								} mr-8 text-purple-500 gap-4`}
								onClick={() => {
									toggleClass(2);
								}}
							>
								Mint ERC1155
							</a>
						</Link>
						<Link href="/CollectionView">
							<a
								className={`${
									isActive[3] ? bottomBorderClass : ''
								} mr-8 text-purple-500 gap-4`}
								onClick={() => {
									toggleClass(3);
								}}
							>
								Collection
							</a>
						</Link>
						<Link href="/CreatedView">
							<a
								className={`${
									isActive[4] ? bottomBorderClass : ''
								} mr-8 text-purple-500 gap-4`}
								onClick={() => {
									toggleClass(4);
								}}
							>
								Created
							</a>
						</Link>
					</div>
				</nav>
				<Component {...pageProps}/>
				<div className="py-4"></div>
			</div>
			<footer
				className="flex justify-center border-t border-gray-500 py-8 inset-x-0 bottom-0 p-4"
			>
				<Link href="https://github.com/JaredBorders/OctoPlace/blob/master/whitepaper_v1.pdf"><a className="px-6 text-gray-400">Whitepaper</a></Link>
				<Link href="https://github.com/JaredBorders/OctoPlace/tree/master/contracts"><a className="px-6 text-gray-400">Contracts</a></Link>
				<Link href="mailto: jlbxsxs@gmail.com"><a className="px-6 text-gray-400">Contact</a></Link>
				
			</footer>
		</ThemeProvider>
	);
}

export default MyApp;
