import { printLine } from './modules/print';

let products = [];

const updateBadge = () => {
    chrome.runtime.sendMessage({ type: "SET_BADGE_TEXT", value: products.length > 0 ? products.length.toString() : "" });
}

updateBadge();

const getQuery = (document) => {
    const videoTitle = document.querySelector('.title.style-scope.ytd-video-primary-info-renderer').innerText.toLowerCase();
    const index = videoTitle.indexOf('review');
    return index == -1 ? videoTitle : videoTitle.substring(0, index);
}

const getProductLink = (Q) => {
    const KEY = 'AIzaSyD747F8Wq4bALPlpafh3-sU9t3fNtaKT5U';
    const CX = 'f013e1116c6108d66';

    const init = {
        method: 'GET',
    }

    return fetch(`https://www.googleapis.com/customsearch/v1?key=${KEY}&cx=${CX}&q=${Q}&num=1`, init)
        .then(res => new Response(res.body).json())
        .then(res => {
            console.log(res.items)

            return res.items[0].link;
        });
}

const getWebCode = (link) => {
    return fetch(link)
        .then(res => res.text())
        .then(text => {
            const parser = new DOMParser();
            const htmlDocument = parser.parseFromString(text, "text/html");
            const xpath = "//strong[contains(text(),'Web Code')]";
            const matchingElement = htmlDocument.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            console.log(matchingElement.nextSibling)
            return matchingElement.nextSibling;
        });
}

const getProductInfo = (webCode) => {
    return fetch(`https://www.bestbuy.ca/api/v2/json/product/${webCode}?&include=all&lang=en-CA`)
        .then(res => new Response(res.body).json())
        .then(json => ({
            name: json.name,
            regularPrice: json.regularPrice,
            salePrice: json.salePrice || json.regularPrice,
            img: json.thumbnailImage,
            url: json.productUrl
        }));
}

window.addEventListener('load', async () => {
    if (window.location.href.includes('https://www.youtube.com/watch')) {
        const query = getQuery(document);
        const productLink = await getProductLink(query);
        const webCode = await getWebCode(productLink);
        const productInfo = await getProductInfo(productLink);

        products.push(productInfo);
        updateBadge();
    }
    // console.log(pageText);
    // if (pageText.includes("iphone 11")) {
    //     products.push({ img: "https://multimedia.bbycastatic.ca/multimedia/products/500x500/138/13888/13888819.jpg", url: "https://www.bestbuy.ca/en-ca/product/apple-iphone-11-64gb-purple-unlocked/13888819", name: "iphone 11" });
    //     updateBadge();
    // }
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