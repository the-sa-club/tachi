

  const body = document.querySelector("body");
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.id = "cid_theclub";
  script.setAttribute('cid', chrome.runtime.id)
  script.src = chrome.extension.getURL("inpage.js");
  body.appendChild(script);
