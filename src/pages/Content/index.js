import { printLine } from './modules/print';

let products = [];

const updateBadge = () => {
    chrome.runtime.sendMessage({ type: "SET_BADGE_TEXT", value: products.length > 0 ? products.length.toString() : "" });
}

updateBadge();

window.addEventListener('load', function () {
    const pageText = document.body.innerText.toLowerCase();
    console.log(pageText);
    if (pageText.includes("iphone 11")) {
        products.push({ img: "https://multimedia.bbycastatic.ca/multimedia/products/500x500/138/13888/13888819.jpg", url: "https://www.bestbuy.ca/en-ca/product/apple-iphone-11-64gb-purple-unlocked/13888819", name: "iphone 11" });
        updateBadge();
    }
})

chrome.runtime.onMessage.addListener(
    function (msg, sender, sendResponse) {
        console.log("received " + msg.type);
        switch (msg.type) {
            case "GET_PRODUCTS":
                sendResponse({ products: products });
                break;
            case "NOT_INTERESTED":
                products.splice(msg.idx, 1);
                updateBadge();
                break;
            default:
                console.error("unrecognised message: ", msg);
        }
    }
);