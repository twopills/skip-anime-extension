chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'skipVideo') {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          function: skipVideo
        });
      });
    }
  });
  
  function skipVideo() {
    const videoElement = document.querySelector('video');
    if (videoElement) {
      videoElement.currentTime += 85;
    }
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "get_current_url") {
      const url = sender.tab.url;
      sendResponse({ url: url });
    }
  });