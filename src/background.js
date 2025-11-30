chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        chrome.tabs.sendMessage(tabId, {
            action: 'url_changed',
            url: tab.url
        }).catch(err => {
            // Content script might not be loaded yet or connection closed, which is fine
            // console.log('Could not send message to tab:', err);
        });
    }
});
