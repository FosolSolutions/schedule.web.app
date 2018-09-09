(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{"./src/__assets__/styles/core.scss":function(e,t,r){},"./src/entry.js":function(e,t,r){"use strict";var n=f(r("./node_modules/react/index.js")),s=f(r("./node_modules/react-dom/index.js")),a=r("./node_modules/react-hot-loader/index.js"),o=r("./node_modules/@material-ui/core/styles/index.js"),u=r("./node_modules/jss/lib/index.js"),d=f(r("./node_modules/react-jss/lib/JssProvider.js")),l=r("./node_modules/react-redux/es/index.js"),c=r("./src/redux/store.js"),i=f(r("./src/features/app/components/App/App.js"));function f(e){return e&&e.__esModule?e:{default:e}}r("./src/__assets__/styles/core.scss");var p=(0,o.createGenerateClassName)(),_=(0,u.create)((0,o.jssPreset)()),E=(0,c.configureStore)(),m=(0,o.createMuiTheme)({palette:{primary:{main:"#133f5b"},secondary:{main:"#34b0ff"}}});_.options.insertionPoint="insertion-point-jss",window.redux={store:E};!function(e){s.default.render(n.default.createElement(a.AppContainer,null,n.default.createElement(l.Provider,{store:E},n.default.createElement(o.MuiThemeProvider,{theme:m},n.default.createElement(d.default,{jss:_,generateClassName:p},n.default.createElement(e,null))))),document.getElementById("app"))}(i.default)},"./src/features/app/components/App/App.js":function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.App=void 0;var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}();t.mapDispatchToProps=m;var s=_(r("./node_modules/prop-types/index.js")),a=_(r("./node_modules/react/index.js")),o=r("./node_modules/react-redux/es/index.js"),u=_(r("./src/redux/actions/calendarsActions.js")),d=r("./src/redux/reducers/calendarsReducer.js"),l=_(r("./node_modules/@material-ui/core/AppBar/index.js")),c=_(r("./node_modules/@material-ui/core/Button/index.js")),i=_(r("./node_modules/@material-ui/icons/AccountCircle.js")),f=_(r("./node_modules/@material-ui/icons/Event.js")),p=_(r("./src/features/app/components/App/app.scss"));function _(e){return e&&e.__esModule?e:{default:e}}var E=t.App=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var r=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return e.setCalendars(),r}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,a["default"].Component),n(t,[{key:"render",value:function(){return function(){return a.default.createElement(l.default,{className:p.default.appBar,position:"static"},a.default.createElement("div",{className:p.default.leftContainer},a.default.createElement(f.default,null),a.default.createElement("h1",{className:p.default.appTitle},"EventStack")),a.default.createElement(c.default,{className:p.default.login},a.default.createElement("span",{className:p.default.buttonLabel},"Login"),a.default.createElement(i.default,null)))}}()}]),t}();function m(e){return{setCalendars:function(){return function(){e(u.default.apply(void 0,arguments))}}()}}t.default=(0,o.connect)(function(e){return{calendars:(0,d.selectCalendars)(e)}},m)(E),E.propTypes={setCalendars:s.default.func.isRequired},E.defaultProps={}},"./src/features/app/components/App/app.scss":function(e,t,r){e.exports={appBar:"YNQYo",appTitle:"yqsvc",buttonLabel:"_3t5GM",leftContainer:"_19_2C",login:"_1-pHn"}},"./src/redux/actionTypes.js":function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.FETCH_CALENDARS="FETCH_CALENDARS",t.FETCH_CALENDARS_SUCCESS="FETCH_CALENDARS_SUCCESS",t.FETCH_CALENDARS_ERROR="FETCH_CALENDARS_ERROR",t.FETCH_CALENDAR="FETCH_CALENDAR",t.FETCH_CALENDAR_SUCCESS="FETCH_CALENDAR_SUCCESS",t.FETCH_CALENDAR_ERROR="FETCH_CALENDAR_ERROR"},"./src/redux/actions/calendarsActions.js":function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){return function(e){e({type:s.FETCH_CALENDARS}),n.default.get("https://fosolschedule.azurewebsites.net/data/calendars").then(function(t){e({type:s.FETCH_CALENDARS_SUCCESS,calendars:t.data})}).catch(function(t){e({type:s.FETCH_CALENDARS_ERROR,error:t})})}};var n=function(e){return e&&e.__esModule?e:{default:e}}(r("./node_modules/axios/index.js")),s=r("./src/redux/actionTypes.js")},"./src/redux/reducers/calendarsReducer.js":function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.initialCalendarsState=void 0,t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:a,t=arguments[1],r=void 0;switch(t.type){case s.FETCH_CALENDARS:r=(0,n.default)(e,{isLoading:{$set:!0}});break;case s.FETCH_CALENDARS_ERROR:r=(0,n.default)(e,{isLoading:{$set:!1},error:{$set:t.error}});break;case s.FETCH_CALENDARS_SUCCESS:r=(0,n.default)(e,{isLoading:{$set:!1},error:{$set:null},calendars:{$set:t.calendars}});break;default:r=e}return r},t.selectCalendars=function(e){return e.calendars.calendars},t.selectCalendarsIsLoading=function(e){return e.calendars.isLoading},t.selectCalendarsError=function(e){return e.calendars.error};var n=function(e){return e&&e.__esModule?e:{default:e}}(r("./node_modules/immutability-helper/index.js")),s=r("./src/redux/actionTypes.js");var a=t.initialCalendarsState={calendars:[],error:null,isLoading:!1}},"./src/redux/reducers/rootReducer.js":function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r("./node_modules/redux/es/redux.js"),s=function(e){return e&&e.__esModule?e:{default:e}}(r("./src/redux/reducers/calendarsReducer.js"));var a=(0,n.combineReducers)({calendars:s.default});t.default=a},"./src/redux/store.js":function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.configureStore=u;var n=r("./node_modules/redux/es/redux.js"),s=o(r("./node_modules/redux-thunk/es/index.js")),a=o(r("./src/redux/reducers/rootReducer.js"));function o(e){return e&&e.__esModule?e:{default:e}}function u(){var e=(0,n.applyMiddleware)(s.default)(n.createStore),t=(0,n.compose)(window.devToolsExtension?window.devToolsExtension():function(e){return e});return e(a.default,{},t)}t.default=u}},[["./src/entry.js",2,1]]]);