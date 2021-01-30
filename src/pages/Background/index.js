import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    console.log("received " + msg.type);
    switch (msg.type) {
        case "SET_BADGE_TEXT":
            chrome.browserAction.setBadgeText({ text: msg.value });
            break
        default:
            console.error("unrecognised message: ", msg);
    }
});