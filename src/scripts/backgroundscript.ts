console.log("From Background");

chrome.runtime.onMessageExternal.addListener(
  async (request, sender, sendResponse) => {
    if (request.message == "tx_signing_!@#") {
      console.log(request.data);
      chrome.tabs.create(
        {
          url:
            chrome.extension.getURL("txApproval.html") +
            "?param=" +
            JSON.stringify(request.data),
          active: false,
        },
        function (tab) {
          // After the tab has been created, open a window to inject the tab
          chrome.windows.create({
            tabId: tab.id,
            type: "popup",
            focused: true,
            top: 0,
            left: screen.width,
            height: 550,
            width: 800,

            // incognito, top, left, ...
          });
        }
      );

      window.onstorage = (e) => {
        if (e.key != "tx_signing_msgs") return;
        const message = JSON.parse(e.newValue);
        console.log("from storage", message);
        sendResponse(message);
      };
    }

    if (request.message == "claim_!@#") {
      console.log(request.data);
      chrome.tabs.create(
        {
          url:
            chrome.extension.getURL("claimApproval.html") +
            "?param=" +
            JSON.stringify(request.data),
          active: false,
        },
        function (tab) {
          // After the tab has been created, open a window to inject the tab
          chrome.windows.create({
            tabId: tab.id,
            type: "popup",
            focused: true,
            top: 0,
            left: screen.width,
            height: 500,
            width: 500,

            // incognito, top, left, ...
          });
        }
      );

      window.onstorage = (e) => {
        if (e.key != "claim_msgs") return;
        const message = JSON.parse(e.newValue);
        console.log("from storage", message);
        sendResponse(message);
      };
    }

    if (request.message == "sync_!@#") {
      chrome.tabs.create(
        {
          url:
            chrome.extension.getURL("syncApproval.html") +
            "?param=" +
            sender.origin,
          active: false,
        },
        (tab) => {
          chrome.windows.create({
            tabId: tab.id,
            type: "popup",
            focused: true,
            top: 0,
            left: screen.width,
            height: 500,
            width: 400,
          });
        }
      );

      window.onstorage = (e) => {
        if (e.key != "sync_msgs") return;
        const message = JSON.parse(e.newValue);
        console.log("from storage", message);
        sendResponse(message);
      };
    }
  }
);
