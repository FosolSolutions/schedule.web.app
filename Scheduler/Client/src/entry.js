//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import { Router } from "react-router-dom";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "material-ui-pickers";
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
import "utils/polyfills";

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
import {
    COLOR_PRIMARY_MAIN,
    COLOR_PRIMARY_LIGHT,
    COLOR_SECONDARY_MAIN,
    COLOR_SECONDARY_DARK,
    COLOR_ERROR_MAIN,
    COLOR_DEFAULT_MAIN,
} from "utils/constants";
import history from "utils/history";

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
            main: COLOR_PRIMARY_MAIN,
            light: COLOR_PRIMARY_LIGHT,
        },
        secondary: {
            main: COLOR_SECONDARY_MAIN,
            dark: COLOR_SECONDARY_DARK,
        },
        error: {
            main: COLOR_ERROR_MAIN,
        },
        default: {
            main: COLOR_DEFAULT_MAIN,
            light: "red",
        },
    },
    typography: {
        useNextVariants: true,
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
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Router history={history}>
                                <Component />
                            </Router>
                        </MuiPickersUtilsProvider>
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
