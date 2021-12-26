module.exports = {
	darkMode: 'class',
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			gridAutoRows: {
				'1fr': 'minmax(0, 1fr)',
			},
		},
	},
	plugins: [],
};
