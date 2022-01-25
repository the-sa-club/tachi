/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**************************************!*\
  !*** ./src/scripts/contentscript.ts ***!
  \**************************************/
var body = document.querySelector("body");
var script = document.createElement("script");
script.type = "text/javascript";
script.id = "cid_theclub";
script.setAttribute('cid', chrome.runtime.id);
script.src = chrome.extension.getURL("inpage.js");
body.appendChild(script);

/******/ })()
;
//# sourceMappingURL=contentscript.js.map