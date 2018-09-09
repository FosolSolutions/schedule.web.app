// Note: Configuration must remain JSON-serializable
module.exports = {
    moduleDirectories: ["src/", "node_modules"],
    moduleNameMapper: {
        "\\.(jpg|jpeg|png|gif|svg|woff|woff2|modernizrrc)$":
            "<rootDir>/src/__mocks__/mockFile.js",
        "\\.(css|scss)$": "identity-obj-proxy"
    },
    setupTestFrameworkScriptFile: "<rootDir>/jestSetup.js",
    testEnvironment: "jsdom",
    verbose: true
};
