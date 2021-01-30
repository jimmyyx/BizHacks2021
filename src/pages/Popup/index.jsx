import React from 'react';
import { render } from 'react-dom';

import ProductPopup from './ProductPopup';
import Signin from './Signin';
import Cashback from './Cashback';
import './index.css';

const POPUP_STATES = Object.freeze({
    signIn: 'SIGN_IN',
    product: 'PRODUCT',
});

const Popup = () => {
    const [popUpState, setPopUpState] = React.useState(POPUP_STATES.signIn);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: "GET_POPUP_STATE" }, (response) => {
            setPopUpState(response);
        });
    });

    chrome.runtime.onMessage.addListener((msg) => {
        setPopUpState(msg.popUpState);
    });

    if (popUpState == POPUP_STATES.product) {
        return <ProductPopup />;
    } else {
        return <Signin />;
    }
}

render(<Popup />, window.document.querySelector('#app-container'));
