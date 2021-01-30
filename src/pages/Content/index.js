import { printLine } from './modules/print';

let products = [];

window.addEventListener('load', function () {
    const pageText = document.body.innerText.toLowerCase();
    console.log(pageText);
    if (pageText.includes("iphone 11")) {
        chrome.runtime.sendMessage({ type: "SET_BADGE_TEXT", value: "1" }, function (response) {
            return false;
        });
        products.push("iphone 11");
    }
})

chrome.runtime.onMessage.addListener(
    function (msg, sender, sendResponse) {
        console.log("received " + msg.type);
        switch (msg.type) {
            case "GET_PRODUCTS":
                sendResponse({ products: products });
                break;
            default:
                console.error("unrecognised message: ", msg);
        }
    }
);