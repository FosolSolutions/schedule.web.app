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
import { SIGN_OFF_SUCCESS } from "redux/actionTypes";

//------------------------------------------------------------------------------

const appReducer = combineReducers({
    calendars: calendarReducer,
    ui: uiReducer,
    user: userReducer,
});

const rootReducer = (state, action) => {
    let newState;

    if (action.type === SIGN_OFF_SUCCESS) {
        newState = undefined;
    } else {
        newState = state;
    }

    return appReducer(newState, action);
};


export default rootReducer;
