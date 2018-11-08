//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import { combineReducers } from "redux";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import calendarReducer from "redux/reducers/calendarReducer";
import uiReducer from "redux/reducers/uiReducer";
import userReducer from "redux/reducers/userReducer";

//------------------------------------------------------------------------------

const rootReducer = combineReducers({
    calendars: calendarReducer,
    ui: uiReducer,
    user: userReducer,
});

export default rootReducer;
