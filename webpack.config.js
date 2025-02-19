const IgnoreWarningsPlugin = require("ignore-warnings-webpack-plugin");

module.exports = {
    plugins: [
        new IgnoreWarningsPlugin([
        /Failed to parse source map/, // Ignore source map warnings
        ]),
    ],
};
