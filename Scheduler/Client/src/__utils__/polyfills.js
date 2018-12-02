//------------------------------------------------------------------------------
// Conditionally require polyfills
//------------------------------------------------------------------------------

// Can't polyfill this one on window, as there are multiple parts to it that
// are buried in the official W3C polyfill
if (!window.IntersectionObserver) {
    require("intersection-observer"); // eslint-disable-line
}
