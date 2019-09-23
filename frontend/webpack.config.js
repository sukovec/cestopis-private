const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');


module.exports = {
	mode: "development", 
	entry: './app/index.tsx',
	devtool: "inline-source-map",
	module: {
		rules: [
			{
				test: /\.css$/,
				include: path.join(__dirname, 'src/components'),
				use: [
					'style-loader',
					{
						loader: 'typings-for-css-modules-loader',
						options: {
							modules: true,
							namedExport: true
						}
					}
				]
			},
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		],
	},
	resolve: {
		extensions: [ '.tsx', '.ts', '.js' ]
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	plugins: [
		new CopyPlugin( [ { "from": "static", "to": "." } ])
	]
};


