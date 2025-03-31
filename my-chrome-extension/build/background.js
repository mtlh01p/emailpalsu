// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "checkFactuality") {
      fetch("http://localhost:5000/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: request.text })
      })
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          sendResponse(data); // Send the response here!
      })
      .catch(error => {
          console.error("Error:", error);
          sendResponse({ error: "Failed to process the request" }); // Send error response
      });
      return true; // Indicate asynchronous response
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
      id: "analyse-text",
      title: "Analyse",
      contexts: ["selection"],
  }, () => {
      if (chrome.runtime.lastError) {
          console.error("Context menu creation failed:", chrome.runtime.lastError);
      } else {
          console.log("Context menu created successfully!");
      }
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "analyse-text" && info.selectionText) {
      chrome.scripting.executeScript(
          {
              target: { tabId: tab.id },
              files: ["content.js"],
          },
          () => {
              chrome.tabs.sendMessage(tab.id, { action: "analyseText", text: info.selectionText });
          }
      );
  }
});