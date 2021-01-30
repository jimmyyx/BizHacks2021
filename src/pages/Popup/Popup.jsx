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
        {
          products.length > 0 ?
            (<ul className="no-bullets">
              {
                products.map(function (product, idx) {
                  return (
                    <li key={idx}>
                      <div className="Product">
                        <img src={product.img} className="App-image" />
                        <a className="App-link" href={product.url} target="_blank" rel="noopener noreferrer">
                          {product.name}
                        </a>
                      </div>
                      <div className="Product-actions">
                        <button>Not interested</button>
                        <button>Add to cart</button>
                      </div>
                    </li>
                  )
                })
              }
            </ul>)
            :
            (<p>No products found on this page. Check back later!</p>)
        }
      </header>
    </div>
  );
};

export default Popup;
