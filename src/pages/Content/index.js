import { printLine } from './modules/print';

const proxyUrl = 'https://tranquil-oasis-83912.herokuapp.com';
const products = [];

const updateBadge = () => {
    chrome.runtime.sendMessage({ type: "SET_BADGE_TEXT", value: products.length > 0 ? products.length.toString() : "" });
}

updateBadge();

const getQuery = (document) => {
    const videoTitle = document.querySelector('.title.style-scope.ytd-video-primary-info-renderer').innerText.toLowerCase();
    const index = videoTitle.indexOf('review');
    return index == -1 ? videoTitle : videoTitle.substring(0, index);
}

const getProductLinks = (Q) => {
    const KEY = 'AIzaSyD747F8Wq4bALPlpafh3-sU9t3fNtaKT5U';
    const CX = 'f013e1116c6108d66';

    const init = {
        method: 'GET',
    }

    return fetch(`https://www.googleapis.com/customsearch/v1?key=${KEY}&cx=${CX}&q=${Q}&num=10`, init)
        .then(res => {
            return new Response(res.body).json()
        })
        .then(res => {
            return res.items.map(item => item.link);
        })
        .catch((e) => {
            console.error(e);
        });
}

const getWebCode = (link) => {
    return fetch(`${proxyUrl}/${link}`)
        .then(res => res.text())
        .then(text => {
            const parser = new DOMParser();
            const htmlDocument = parser.parseFromString(text, "text/html");
            const xpath = "//strong[contains(text(),'Web Code')]";
            const matchingElement = htmlDocument.evaluate(xpath, htmlDocument, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            return matchingElement.nextSibling.innerText;
        })
        .catch((e) => {
            console.error(e);
        });
}

const getProductInfo = async (productLink) => {
    const webCode = await getWebCode(productLink);
    if (webCode) {
        return fetch(`${proxyUrl}/https://www.bestbuy.ca/api/v2/json/product/${webCode}?&include=all&lang=en-CA`)
            .then(res => new Response(res.body).json())
            .then(json => ({
                name: json.name,
                regularPrice: json.regularPrice,
                salePrice: json.salePrice || json.regularPrice,
                img: json.thumbnailImage,
                url: json.productUrl
            }))
            .catch((e) => {
                console.error(e);
            });
    }
}

const getProducts = async () => {
    if (window.location.href.includes('https://www.youtube.com/watch')) {
        const query = getQuery(document);
        const productLinks = await getProductLinks(query);
        await Promise.all(productLinks.map(async productLink => {
            const productInfo = await getProductInfo(productLink);
            if (productInfo) {
                products.push(productInfo);
                updateBadge();
            }
        }));

        updateBadge();
    }
}

window.addEventListener('load', () => getProducts());

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