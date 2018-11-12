// -----------------------------------------------------------------------------
// Global requires
// -----------------------------------------------------------------------------
const path = require("path");
const webpack = require("webpack");

// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Configure your desired local development path here
// -----------------------------------------------------------------------------
const domain = "localhost";
const devServerPort = "3001";

// -----------------------------------------------------------------------------

const devServerPath = `//${domain}:${devServerPort}`;

module.exports = {
    cache: true,
    devtool: "eval",

    entry: [
        "react-hot-loader/patch",
        `webpack-hot-middleware/client?path=${devServerPath}/__webpack_hmr`,
        "./Client/src/entry",
    ],

    mode: "development",

    output: {
        path: path.join(__dirname, "./wwwroot/client"),
        filename: "bundle.js",
        publicPath: `${devServerPath}/`,
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    ],

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"],
        modules: [path.resolve(__dirname, "Client/src/"), "node_modules"],
    },

    module: {
        rules: [
            // All global styles live in core.scss. Load these normally.
            {
                test: /core\.scss$/,
                exclude: /node_modules/,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            // Load the rest of the styles as css modules.
            {
                test: /\.scss$/,
                exclude: [/node_modules/, /core\.scss$/],
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            modules: true,
                            importLoaders: 1,
                            localIdentName: "[name]__[local]___[hash:base64:5]",
                        },
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
            {
                test: /\.(tsx?)|(js)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        cacheDirectory: true,
                    },
                },
            },
            {
                test: /\.(gif|jpe?g|png|svg)$/i,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 10000,
                            name: "__assets__/images/[name].[ext]",
                        },
                    },
                ],
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 10000,
                            mimetype: "application/font-woff",
                            name: "__assets__/fonts/[name].[ext]",
                        },
                    },
                ],
            },
        ],
    },
};
