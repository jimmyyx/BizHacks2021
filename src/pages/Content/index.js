import { printLine } from './modules/print';

let products = [];

chrome.runtime.sendMessage({ type: "SET_BADGE_TEXT", value: "" });
window.addEventListener('load', function () {
    const pageText = document.body.innerText.toLowerCase();
    console.log(pageText);
    if (pageText.includes("iphone 11")) {
        products.push({ img: "https://multimedia.bbycastatic.ca/multimedia/products/500x500/138/13888/13888819.jpg", url: "https://www.bestbuy.ca/en-ca/product/apple-iphone-11-64gb-purple-unlocked/13888819", name: "iphone 11" });
        chrome.runtime.sendMessage({ type: "SET_BADGE_TEXT", value: products.length }, function (response) {
            return false;
        });
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