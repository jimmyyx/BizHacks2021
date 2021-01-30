import React from 'react';
import Greetings from '../../containers/Greetings/Greetings';
import './Signin.css';
import logo from '../../assets/img/logo.svg';
import { Input } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import Button from "antd-button-color";


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
                    <div className="descriptionFont">Email Address</div>
                    <Input placeholder="Email" />
                    <div className="descriptionFont">Password</div>
                    <Input.Password
                        placeholder="Input Password"
                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                    <p></p>
                    <Button type="primary">Sign In</Button>
                    <p></p>
                    <Button type="secondary">Forget Password?</Button>

                </div>
            </header>
        </div >
    );
};

export default Signin;
