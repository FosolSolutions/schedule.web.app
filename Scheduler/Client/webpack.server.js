/* eslint no-console: 0 */
const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleWare = require("webpack-dev-middleware");
const webpackHotMiddleWare = require("webpack-hot-middleware");
const config = require("./webpack.config.dev");

const app = express();
const compiler = webpack(config);
const publicPath = config.output.publicPath;
const devServerPort = publicPath.match(/(?::)(\d{1,5})/)[1];
let server = "";

app.use(
    webpackDevMiddleWare(compiler, {
        headers: { "Access-Control-Allow-Origin": "*" },
        publicPath,
        noInfo: false,
        quiet: false,
        lazy: false,
        stats: {
            colors: true,
            cached: false,
        },
    }),
);

app.use(webpackHotMiddleWare(compiler));

server = app.listen(devServerPort, "0.0.0.0", (err) => {
    if (err) {
        console.log(err);
        return;
    }

    console.log(
        `Webpack dev server listening at http://0.0.0.0:${devServerPort}`,
    );
    console.log("Performing initial build...");
});

// This is necessary until we upgrade node > 8.11 as node 8 < 8.11 aborts HTTP
// connections after 5s even for keep-alive connections (encountered when
// loading large webpack dev bundle on some mobile browsers). Was fixed here:
// https://github.com/nodejs/node/issues/13391
server.keepAliveTimeout = 120000;
