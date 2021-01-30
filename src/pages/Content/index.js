import { printLine } from './modules/print';

printLine('Content script works!');
window.addEventListener('load', function () {
    const pageText = document.body.innerText;
    console.log(pageText);
})
