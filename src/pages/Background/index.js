import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';

window.addEventListener('unload', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.browserAction.setBadgeText({ text: "", tabId: tabs[0].id });
    });
})

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    console.log("received " + msg.type);
    switch (msg.type) {
        case "SET_BADGE_TEXT":
            chrome.browserAction.setBadgeText({ text: msg.value, tabId: sender.tab.id });
            break
        default:
            console.error("unrecognised message: ", msg);
    }
});