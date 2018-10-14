module.exports = function babelConfig(api) {
    "use strict";

    const ENV = api.env();
    const presets = [
        [
            "@babel/env",
            {
                targets: {
                    browsers: ["last 4 years"],
                },
            },
        ],
        "@babel/react",
    ];
    const plugins = [
        [
            "module-resolver",
            {
                root: ["./src"],
                alias: {
                    assets: "./src/__assets__",
                    mocks: "./src/__mocks__",
                    utils: "./src/__utils__",
                    modernizr: "./.modernizrrc",
                },
            },
        ],
    ];

    switch (ENV) {
        // Use hot module replacement in development environment
        case "DEV":
            plugins.push("react-hot-loader/babel");
            break;
        default:
    }

    return {
        presets,
        plugins,
    };
};
