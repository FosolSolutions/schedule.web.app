//------------------------------------------------------------------------------
// Third-party
//------------------------------------------------------------------------------
import createBrowserHistory from "history/createBrowserHistory";

//------------------------------------------------------------------------------

// This enables us to share the same browser history between react-router and
// the rest of the application. This is taking advantage of the fact that in
// NodeJS the exports are singleton - so everytime you `import something` you
// get the same copy of the element that was imported earlier (warning: this can
// lead to mutation, so do take care!)
const history = createBrowserHistory();
export default history;
