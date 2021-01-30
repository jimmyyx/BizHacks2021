import { printLine } from './modules/print';

window.addEventListener('load', function () {
    const pageText = document.body.innerText.toLowerCase();
    console.log(pageText);
    if (pageText.includes("iphone 11")) {
        chrome.runtime.sendMessage({ type: "SET_BADGE_TEXT", value: "1" }, function (response) {
            return false;
        });
    }
})

chrome.runtime.onMessage.addListener(
    function (msg, sender, sendResponse) {
        console.log("received " + msg.type);
        switch (msg.type) {
            case "GET_PRODUCTS":
                sendResponse({ products: ["iphone 11"] });
                break;
            default:
                console.error("unrecognised message: ", msg);
        }
    }
);