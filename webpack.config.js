module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: "pre",
                loader: "source-map-loader",
                exclude: /node_modules/, // Exclude ALL node_modules (including nsfwjs)
            },
        ],
    },
    // Add development optimizations
    ...(process.env.NODE_ENV === 'development' && {
            devServer: {
            hot: true,
            liveReload: false,
            watchOptions: {
                aggregateTimeout: 300,
                poll: 1000,
                ignored: /node_modules/,
            },
        },
            optimization: {
            removeAvailableModules: false,
            removeEmptyChunks: false,
            splitChunks: false,
        },
    }),
};