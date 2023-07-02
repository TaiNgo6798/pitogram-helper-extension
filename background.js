// Function to set a cookie for a specific URL
function setCookie(url, name, value) {
  chrome.cookies.set({
    url,
    name,
    value,
    expirationDate: new Date().getTime() / 1000 + 3600 * 24,
  });
}

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "extractCookies") {
    try {
      const domain = "instagram.com";
      let cookieString = "";
      chrome.cookies.getAll({ domain }, (res) => {
        for (cookie of res) {
          cookieString += `${cookie.name}=${cookie.value};`;
        }
        sendResponse(cookieString);
      });
    } catch (err) {
      sendResponse({ success: false, err: err.message });
    }
  }

  return true;
});

// Function to handle tab update events
function handleTabUpdate(tabId, changeInfo, tab) {
  const shouldSetCookie =
    tab.url.startsWith("https://pitogram.vercel.app") ||
    tab.url.startsWith("http://localhost:3000");
  if (changeInfo.status === "complete" && shouldSetCookie) {
    try {
      const domain = "instagram.com";
      chrome.cookies.getAll({ domain }, (res) => {
        for (cookie of res) {
          setCookie("https://pitogram.vercel.app", cookie.name, cookie.value);
          setCookie("http://localhost:3000", cookie.name, cookie.value);
        }
      });
    } catch (err) {}
  }
}

// Event listener for tab update events
chrome.tabs.onUpdated.addListener(handleTabUpdate);
