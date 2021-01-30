import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';

window.addEventListener('unload', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.browserAction.setBadgeText({ text: "", tabId: tabs[0].id });
    });
});

export const POPUP_STATES = Object.freeze({
    signIn: 'SIGN_IN',
    product: 'PRODUCT',
});

let popUpState = POPUP_STATES.signIn;
let user = {};

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    console.log("received " + msg.type);
    switch (msg.type) {
        case "SET_BADGE_TEXT":
            chrome.browserAction.setBadgeText({ text: msg.value, tabId: sender.tab.id });
            break;
        case 'SIGN_IN':
            user = {
                email: msg.value.email
            };
            popUpState = POPUP_STATES.product;
            break;
        case 'GET_USER':
            sendResponse(user);
            break;
        case 'GET_POPUP_STATE':
            sendResponse(popUpState);
            break;
        default:
            console.error("unrecognised message: ", msg);
    }
});