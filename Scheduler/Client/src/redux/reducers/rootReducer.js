//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import { combineReducers } from "redux";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import calendarsReducer from "redux/reducers/calendarsReducer";

//------------------------------------------------------------------------------

const rootReducer = combineReducers({
    calendars: calendarsReducer
});

export default rootReducer;
