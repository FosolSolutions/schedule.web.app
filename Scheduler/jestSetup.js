//------------------------------------------------------------------------------
// Third party
//------------------------------------------------------------------------------
import Enzyme from "enzyme";
import EnzymeAdapter from "enzyme-adapter-react-16";

//------------------------------------------------------------------------------

// Configure Enzyme adapter
Enzyme.configure({ adapter: new EnzymeAdapter() });

//------------------------------------------------------------------------------
// Mocked third-party and Tempest globals
//------------------------------------------------------------------------------
// Jest comes with jsdom-mocked browser environment built-in, but we need to
// mock any of our own globals by attaching them to the jsdom "global" object
global.ga = () => {};

//------------------------------------------------------------------------------
// Mocked native browser features
//------------------------------------------------------------------------------
// Requiring mock-local-storage adds mocked localStorage to the global and
// window namespaces
require("mock-local-storage");
require("intersection-observer");
global.window.requestAnimationFrame = require("raf");

global.window.scrollTo = () => {};

//------------------------------------------------------------------------------
// Date/Timezone setup
//------------------------------------------------------------------------------
// The native Date creates objects relative to the local timezone, thus
// affecting the JSON formatted dates in our Jest snapshots. This new
// constructor returns a Date object relative to UTC instead, so the tests can
// be run by devs in any timezone.
global.TimezoneAwareDate = Date;
global.Date = class extends global.TimezoneAwareDate {
    constructor(...args) {
        super(...args);
        const nativeDate = new global.TimezoneAwareDate(...args);
        const utcDate = new global.TimezoneAwareDate(
            global.TimezoneAwareDate.UTC(
                nativeDate.getFullYear(),
                nativeDate.getMonth(),
                nativeDate.getDate(),
                nativeDate.getHours(),
                nativeDate.getMinutes(),
                nativeDate.getSeconds(),
                nativeDate.getMilliseconds()
            )
        );

        // Ideally we'd just do
        // super(global.NativeDate(global.NativeDate.UTC(....)), but some of our
        // dependencies check the type of Date object and fail as the extended
        // Date is somehow different from the native Date.
        return utcDate;
    }
};

//------------------------------------------------------------------------------
// DOM manipulation setup
//------------------------------------------------------------------------------
// Set up a fake DOM containing elements required for DOM manipulation methods
// <div id="app"></div> required by cssUtils/disable/enablePageScrolling
global.document.body.innerHTML = "<div id='app'></div>";
