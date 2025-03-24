chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startAnalysis' && message.text) {
    console.log("Content script received analysis request:", message.text);

    fetch('http://localhost:5000/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: message.text }),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Analysis result from server:", data);

        if (data.result) {
          let style = "background-color: yellow;"; // Default style
          if (data.result.includes("Yes, it's a hoax")) {
            style = "background-color: red; color: white; font-weight: bold;";
          }

          // Highlight the statement with the server response
          document.body.innerHTML = document.body.innerHTML.replace(
            new RegExp(message.text, 'g'),
            `<span style="${style}">${message.text} - ${data.result}</span>`
          );
        }
        sendResponse({ message: data.result });
      })
      .catch(error => {
        console.error("Error connecting to server:", error);
        sendResponse({ error: "Failed to fetch analysis." });
      });

    return true; // Keep the messaging channel open for asynchronous response
  }
});