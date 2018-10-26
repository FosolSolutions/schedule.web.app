//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import { combineReducers } from "redux";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import calendarsReducer from "redux/reducers/calendarsReducer";
import uiReducer from "redux/reducers/uiReducer";
import userReducer from "redux/reducers/userReducer";

//------------------------------------------------------------------------------

const rootReducer = combineReducers({
    calendars: calendarsReducer,
    ui: uiReducer,
    user: userReducer,
});

export default rootReducer;
