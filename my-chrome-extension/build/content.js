// content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in content.js:", message);
  if (message.action === "analyseText") {
      const selectedText = message.text.trim();

      if (selectedText) {
          console.log("Valid text for analysis:", selectedText);
          chrome.runtime.sendMessage({ action: "checkFactuality", text: selectedText }, (response) => {
              console.log("Factuality response received:", response);
              if (chrome.runtime.lastError) {
                  console.error("Error sending message:", chrome.runtime.lastError.message);
                  sendResponse({ error: "Failed to process the request" });
              } else {
                  displayPopup(window.getSelection(), response);
              }
          });
          return true;
      } else {
          console.error("No text selected for analysis!");
      }
  }
});

function displayPopup(selection, response) {
  if (!selection || !selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect(); // Get the bounding box of the selected text

  const popup = document.createElement("div");
  popup.style.position = "absolute";
  popup.style.top = `${rect.bottom + window.scrollY + 5}px`; // Position below the selected text
  popup.style.left = `${rect.left + window.scrollX}px`;
  popup.style.backgroundColor = "white";
  popup.style.border = "1px solid #ccc";
  popup.style.padding = "10px";
  popup.style.zIndex = "10000";
  popup.style.boxShadow = "2px 2px 5px rgba(0, 0, 0, 0.3)";

  popup.innerHTML = `
      <p><strong>Answer:</strong> ${response.answer}</p>
      <p><strong>Reason:</strong> ${response.reason}</p>
  `;

  document.body.appendChild(popup);

  // Remove the popup when the user clicks elsewhere
  function handleClickOutside(event) {
      if (!popup.contains(event.target)) {
          popup.remove();
          document.removeEventListener("click", handleClickOutside);
      }
  }

  // Attach the click event listener
  setTimeout(()=> {
      document.addEventListener("click", handleClickOutside);
  }, 100);
}