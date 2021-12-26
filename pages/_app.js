import '../styles/globals.css';
import { ThemeProvider } from 'next-themes';
import Link from 'next/link';

function MyApp({ Component, pageProps }) {
	return (
		<ThemeProvider attribute="class">
			<div>
				<nav className="border-b border-gray-500 p-8">
					<div className="flex mt-4 justify-center">
						<p className="text-4xl font-bold justify-center">OctoPlace</p>
					</div>
					<div className="flex mt-8 justify-center">
						<Link href="/">
							<a className="mr-8 text-purple-500">Market</a>
						</Link>
						<Link href="/CreateView">
							<a className="mr-8 text-purple-500">Mint</a>
						</Link>
						<Link href="/CollectionView">
							<a className="mr-8 text-purple-500">Collection</a>
						</Link>
						<Link href="/CreatedView">
							<a className="mr-8 text-purple-500">Created</a>
						</Link>
					</div>
				</nav>
				<Component {...pageProps} />
			</div>
		</ThemeProvider>
	);
}

export default MyApp;
