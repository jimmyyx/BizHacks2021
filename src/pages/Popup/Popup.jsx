import React from 'react';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';

const Popup = () => {
  const [products, setProducts] = React.useState([]);
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: "GET_PRODUCTS" }, function (response) {
      setProducts(response.products);
    });
  });
  return (
    <div className="App">
      <header className="App-header">
        <ul>
          {
            products.map(function (product, idx) {
              return (
                <li key={idx}>
                  <img src={product.img} className="App-logo" alt="logo" />
                  <a className="App-link" href={product.url} target="_blank" rel="noopener noreferrer">
                    {product.name}
                  </a>
                </li>
              )
            })
          }
        </ul>
      </header>
    </div>
  );
};

export default Popup;
