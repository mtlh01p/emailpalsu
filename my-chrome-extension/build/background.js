chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startAnalysis' && message.text) {
    console.log("Message received in background script:", message);

    // Forward the message to the content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
          sendResponse(response);
        });
      } else {
        console.error("No active tab found.");
        sendResponse({ error: "No active tab available." });
      }
    });

    return true; // Keep the messaging channel open for asynchronous response
  }
});