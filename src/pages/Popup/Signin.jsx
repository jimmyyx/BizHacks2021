import React from 'react';
import Greetings from '../../containers/Greetings/Greetings';
import './Signin.css';
import logo from '../../assets/img/logo.svg';

// const notInterested = (idx) => {
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//         chrome.tabs.sendMessage(tabs[0].id, { type: "NOT_INTERESTED", idx: idx });
//     });
// }

const Signin = () => {
    // const [products, setProducts] = React.useState([]);
    // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //     chrome.tabs.sendMessage(tabs[0].id, { type: "GET_PRODUCTS" }, function (response) {
    //         setProducts(response.products);
    //     });
    // });
    return (
        <div className="SigninApp">
            <header className="SigninApp-header">
                <img src={logo} className="SigninApp-logo" alt="logo" />
                <div className="SigninApp-displayText">

                    <div className="SigninAppFont">Sign In</div>
                    <div></div>
                    <div>Email Address</div>

                    <div>Password</div>
                    <div>
                        Testing
                    </div>
                    <a
                        className="SigninApp-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                </div>
            </header>
        </div>
    );
};

export default Signin;
