import React, { useEffect } from 'react';
import { render } from 'react-dom';

import ProductPopup from './ProductPopup';
import Signin from './Signin';
import Cashback from './Cashback';
import './index.css';

const Popup = () => {
    const [user, setUser] = React.useState();

    useEffect(() => {
        const getData = async () => {
            chrome.runtime.sendMessage({ type: "GET_USER" }, (response) => {
                setUser(response);
            });
        }
        getData();
    }, []);

    chrome.runtime.onMessage.addListener((msg) => {
        if (msg.type == "USER_UPDATED") {
            setUser(msg.user);
        }
    });

    if (user) {
        return <ProductPopup />;
    } else {
        return <Signin />;
    }
}

render(<Popup />, window.document.querySelector('#app-container'));
