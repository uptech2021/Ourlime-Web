const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'firebasestorage.googleapis.com',
				port: '',
				pathname: '/**',
			},
		],
	},
	env: {
		IPINFO_API_TOKEN: process.env.IPINFO_API_TOKEN,
	},
	webpack: (config) => {
		config.module.rules.push(
			{
				test: /\.(ttf|eot|woff|woff2)$/,
				use: {
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'static/fonts/',
					},
				},
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'static/media/[name].[hash:8].[ext]',
						},
					},
				],
			}
		);
		return config;
	},
};

export default nextConfig;
