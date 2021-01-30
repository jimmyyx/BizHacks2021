import React from 'react';
import { render } from 'react-dom';

import Popup from './Popup';
import Signin from './Signin';
import Cashback from './Cashback';
import './index.css';

render(<Cashback />, window.document.querySelector('#app-container'));
