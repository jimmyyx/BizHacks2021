import { printLine } from './modules/print';

printLine('Content script works!');
window.addEventListener('load', function () {
    const pageText = document.body.innerText.toLowerCase();
    console.log(pageText);
    if (pageText.includes("iphone 11")) {
        chrome.runtime.sendMessage({ type: "SET_BADGE_TEXT", value: "1" }, function (response) {
            return false;
        });
    }
})
