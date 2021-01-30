import React from 'react';
import './Cashback.css';
import yellowLogo from '../../assets/img/yellowLogo.png';
import { Input } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import Button from "antd-button-color";

const Cashback = () => {
    return (
        <div className="CashbackApp">
            <header className="CashbackApp-header">

                <div className="CashbackApp-displayText">
                    <div className="flexbox-container">
                        <img src={yellowLogo} className="CashbackApp-logo" alt="logo" />
                        <div className="buttonPadding">
                            <Button type="primary" shape="round">Activate 5% Cash Back</Button>
                        </div>
                    </div>
                </div>
            </header>
        </div >
    );
};

export default Cashback;
