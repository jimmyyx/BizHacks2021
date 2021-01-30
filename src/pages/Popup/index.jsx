import React, { useEffect } from 'react';
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

    useEffect(() => {
        const getData = async () => {
            chrome.runtime.sendMessage({ type: "GET_POPUP_STATE" }, (response) => {
                setPopUpState(response);
            });
        }
        getData();
    }, []);

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
