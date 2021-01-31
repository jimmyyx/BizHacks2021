const proxyUrl = 'https://tranquil-oasis-83912.herokuapp.com';
const products = [];

const youtubeVideoTitleSelector = '.title.style-scope.ytd-video-primary-info-renderer';

const updateBadge = () => {
    chrome.runtime.sendMessage({ type: "SET_BADGE_TEXT", value: products.length > 0 ? products.length.toString() : "" });
}

const getQuery = (document) => {
    const element = document.querySelector(youtubeVideoTitleSelector);
    if (element) {
        const videoTitle = document.querySelector(youtubeVideoTitleSelector).innerText.toLowerCase();
        const index = videoTitle.indexOf('review');
        const query = index == -1 ? videoTitle : videoTitle.substring(0, index);
        console.log(`QUERY IS: ${query}`)
        return query;
    } else {
        return null;
    }
}

const KEY = 'AIzaSyD747F8Wq4bALPlpafh3-sU9t3fNtaKT5U';
const CX = 'f013e1116c6108d66';

const getProductLinks = (Q) => {
    const init = {
        method: 'GET',
    }

    return fetch(`https://www.googleapis.com/customsearch/v1?key=${KEY}&cx=${CX}&q=${Q}&num=3`, init)
        .then(res => {
            return new Response(res.body).json()
        })
        .then(res => {
            const links = res.items.map(item => item.link);
            console.log('PRODUCT LINKS:');
            console.log(links)
            return links;
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

            const imgElement = htmlDocument.querySelector("img[alt='product image']")
            const highResImage = imgElement ? imgElement.getAttribute('src') : null;

            return {
                webCode: matchingElement.nextSibling.innerText,
                highResImage
            };
        })
        .catch((e) => {
            console.error(e);
        });
}

const getProductInfo = async (productLink) => {
    const { webCode, highResImage } = await getWebCode(productLink);
    if (webCode) {
        return fetch(`${proxyUrl}/https://www.bestbuy.ca/api/v2/json/product/${webCode}?&include=all&lang=en-CA`)
            .then(res => new Response(res.body).json())
            .then(json => ({
                name: json.name,
                regularPrice: json.regularPrice,
                salePrice: json.salePrice || json.regularPrice,
                img: highResImage || json.thumbnailImage,
                url: json.productUrl
            }))
            .catch((e) => {
                console.error(e);
            });
    }
}

const getProducts = async (query) => {
    // const query = getQuery(document);
    const productLinks = await getProductLinks(query);
    await Promise.all(productLinks.map(async productLink => {
        const productInfo = await getProductInfo(productLink);
        if (productInfo && !products.some((product) => product.url == productInfo.url)) {
            products.push(productInfo);
            chrome.runtime.sendMessage({ type: "PRODUCTS_UPDATED", products: products })
            updateBadge();
        }
    }));

    updateBadge();
    chrome.runtime.sendMessage({ type: "PRODUCTS_UPDATED", products: products })
}

const waitForElementToDisplay = (selector, callback, checkFrequencyInMs, timeoutInMs) => {
    const startTimeInMs = Date.now();
    (function loopSearch() {
        const query = getQuery(document);
        if (query) {
            callback(query);
            return;
        } else {
            console.log(`could not find element ${selector}`);
        }
        setTimeout(() => {
            if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs) {
                return;
            }
            loopSearch();
        }, checkFrequencyInMs);
    })();
}

const init = () => {
    if (chrome.runtime.id == undefined) return;
    if (window.location.href.includes('https://www.youtube.com/watch')) {
        waitForElementToDisplay(youtubeVideoTitleSelector, getProducts, 1000);
    }
}

let loaded = false;

window.onload = () => {
    if (!loaded) {
        loaded = true;
        init();
    }
};
// window.onpopstate = init;

document.addEventListener('yt-navigate-finish', () => {
    if (loaded) {
        init();
    }
});

chrome.runtime.onMessage.addListener(
    function (msg, sender, sendResponse) {
        console.log("received " + msg.type);
        switch (msg.type) {
            case "GET_PRODUCTS":
                sendResponse({ products });
                break;
            case "NOT_INTERESTED":
                products.splice(msg.idx, 1);
                updateBadge();
                chrome.runtime.sendMessage({ type: "PRODUCTS_UPDATED", products: products })
                break;
            default:
                console.error("unrecognised message: ", msg);
        }
    }
);