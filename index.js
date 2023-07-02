// Log a message to the console of the currently active tab
function logToCurrentTab(message) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // Execute a content script in the active tab
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      args: [message],
      func: (message) => {
        console.log(message);
      },
    });
  });
}

// Button click event listener
// document.getElementById("getCookies").addEventListener("click", function () {
//   logToCurrentTab("start cron insta cookie...");
//   chrome.runtime.sendMessage({ action: "extractCookies" });
// });
