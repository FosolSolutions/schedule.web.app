const path = require("path");
const cssNano = require("cssnano");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

// Uncomment for bundle composition analysis
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
//     .BundleAnalyzerPlugin;

module.exports = {
    // Uncomment this if we want to start using source maps for error reporting
    // or for analysing bundle size from dependencies. In which case, we'll
    // likely want to gitignore the generated source map files.
    // devtool: "source-map",

    entry: {
        app: "./src/entry",
    },

    mode: "production",

    optimization: {
        namedModules: true,
        // Skip the emitting phase whenever there are errors while compiling.
        // This ensures that no assets are emitted that include errors.
        noEmitOnErrors: true,
        runtimeChunk: {
            name: "runtime",
        },
        splitChunks: {
            cacheGroups: {
                default: false,
                vendor: {
                    chunks: "initial",
                    enforce: true,
                    name: "vendor",
                    test: /node_modules/,
                },
                styles: {
                    name: "styles",
                    test: /\.css$/,
                    chunks: "all",
                    enforce: true,
                },
            },
        },
    },

    output: {
        path: path.join(__dirname, "../wwwroot/client"),
        // Append .[chunkhash] after [name] for cache-breaking
        filename: "[name].[chunkhash].js",
        publicPath: "../wwwroot/client",
    },

    plugins: [
        // ExtractTextPlugin extracts and merges CSS modules into a single CSS
        // bundle/file
        new MiniCssExtractPlugin({
            chunkFilename: "styles.[hash].css",
        }),

        // OptimizeCssAssetsPlugin minifies and de-duplicates CSS output by
        // ExtractTextPlugin
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: cssNano,
            cssProcessorOptions: { discardComments: { removeAll: true } },
            canPrint: true,
        }),

        new CompressionPlugin(),

        // Uncomment for bundle composition analysis
        // new BundleAnalyzerPlugin({ analyzerMode: "static" })
    ],

    resolve: {
        extensions: [".js", ".ts", ".scss"],
        modules: [path.resolve(__dirname, "src/"), "node_modules"],
    },

    module: {
        rules: [
            // All global styles live in core.scss. Load these normally.
            {
                test: /core\.scss$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "./",
                        },
                    },
                    "css-loader",
                    "sass-loader",
                ],
            },
            // Load the rest of the styles as css modules.
            {
                test: /\.scss$/,
                exclude: [/node_modules/, /core\.scss$/],
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "./",
                        },
                    },
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            importLoaders: 1,
                            // Just use className hashes in production to
                            // shorten/obfuscate classNames
                            localIdentName: "[hash:base64:5]",
                        },
                    },
                    "postcss-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.jsx?/,
                exclude: /node_modules/,
                use: "babel-loader",
            },
            {
                test: /\.(gif|jpe?g|png|svg)$/i,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 10000,
                            // -[hash] for cache-breaking
                            name: "__assets__/images/[name]-[hash].[ext]",
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
                            // -[hash] for cache-breaking
                            name: "__assets__/fonts/[name]-[hash].[ext]",
                        },
                    },
                ],
            },
        ],
    },
};
