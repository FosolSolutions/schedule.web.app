//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import React from "react";
import ReactDOM from "react-dom";
// eslint-disable-next-line import/no-extraneous-dependencies
import { AppContainer } from "react-hot-loader";
import {
    MuiThemeProvider,
    createMuiTheme,
    createGenerateClassName,
    jssPreset,
} from "@material-ui/core/styles";
import { create } from "jss";
import JssProvider from "react-jss/lib/JssProvider";

//------------------------------------------------------------------------------
// Polyfills
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import { Provider } from "react-redux";
import { configureStore } from "redux/store";

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
import App from "features/app/components/App/App";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Global requires
//------------------------------------------------------------------------------
require("assets/styles/core.scss");

//------------------------------------------------------------------------------

const generateClassName = createGenerateClassName();
const jss = create(jssPreset());
const store = configureStore();
const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#34495e",
            light: "#eceff2",
        },
        secondary: {
            main: "#00a6fb",
            dark: "#0c7cd5",
        },
        error: {
            main: "#fe4a49",
        },
        default: {
            main: "#eceff2",
            light: "red",
        },
    },
    typography: {
        fontFamily: [
            `"Open Sans"`,
            `"Helvetica Neue"`,
            "Arial",
            "sans-serif",
            "-apple-system",
            "BlinkMacSystemFont",
            `"Segoe UI"`,
            `"Apple Color Emoji"`,
            `"Segoe UI Emoji"`,
            `"Segoe UI Symbol"`,
        ].join(","),
    },
});

jss.options.insertionPoint = "insertion-point-jss";

// Make redux store globally accessible (for debugging)
window.redux = { store };

/**
 * Render the passed component into the AppContainer parent (required for
 * react-hot-loader) and the Provider parent (required for redux)
 *
 * @param  {React} Component React component
 */
const render = (Component) => {
    ReactDOM.render(
        <AppContainer>
            <Provider store={store}>
                <MuiThemeProvider theme={theme}>
                    <JssProvider
                        jss={jss}
                        generateClassName={generateClassName}
                    >
                        <Component />
                    </JssProvider>
                </MuiThemeProvider>
            </Provider>
        </AppContainer>,
        document.getElementById("app"),
    );
};

render(App);

// Check if module is hot (i.e. the dev server is running). If so accept it and
// re-require to pull in the changes for hot updating.
if (module.hot) {
    module.hot.accept("features/app/components/App/App", () => {
        // eslint-disable-next-line global-require
        const NextApp = require("features/app/components/App/App").default;
        render(NextApp);
    });
}
