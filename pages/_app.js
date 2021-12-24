import '../styles/globals.css';
import { ThemeProvider } from 'next-themes';
import Link from 'next/link';

function MyApp({ Component, pageProps }) {
	return (
		<ThemeProvider attribute="class">
			<div>
				<nav className="border-b border-gray-500 p-6">
					<div className="flex mt-4 justify-center">
						<p className="text-4xl font-bold justify-center">OctoPlace</p>
					</div>
					<div className="flex mt-4 justify-center">
						<Link href="/">
							<a className="mr-8 text-purple-500">Market</a>
						</Link>
						<Link href="/CreateNFTView">
							<a className="mr-8 text-purple-500">Create NFT</a>
						</Link>
						<Link href="/profile">
							<a className="mr-8 text-purple-500">Profile</a>
						</Link>
						<Link href="/dashboard">
							<a className="mr-8 text-purple-500">Dashboard</a>
						</Link>
					</div>
				</nav>
				<Component {...pageProps} />
			</div>
		</ThemeProvider>
	);
}

export default MyApp;
