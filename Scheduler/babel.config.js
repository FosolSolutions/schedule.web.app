module.exports = function babelConfig(api) {
    const ENV = api.env();
    const presets = [
        [
            "@babel/env",
            {
                useBuiltIns: "entry",
            },
        ],
        "@babel/react",
    ];
    const plugins = [
        [
            "module-resolver",
            {
                root: ["./Client/src"],
                alias: {
                    assets: "./Client/src/__assets__",
                    mocks: "./Client/src/__mocks__",
                    utils: "./Client/src/__utils__",
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
