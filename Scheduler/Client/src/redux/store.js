import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import rootReducer from "redux/reducers/rootReducer";

/**
 * Configure and return the redux store
 *
 * @return {Object} Redux store
 */
export function configureStore() {
    const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
    // Connect to the dev tools extension if available, otherwise return the
    // store
    const enhancers = compose(
        // eslint-disable-next-line
        window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f,
    );
    const store = createStoreWithMiddleware(rootReducer, {}, enhancers);

    if (module.hot) {
        // Subscribe to and apply hot module updates for reducers
        module.hot.accept("redux/reducers/rootReducer", () => {
            // eslint-disable-next-line global-require
            const nextRootReducer = require("redux/reducers/rootReducer")
                .default;

            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}

export default configureStore;
