import React, { useEffect } from 'react';
import { Card } from 'antd';
import { CloseOutlined, ShoppingOutlined } from '@ant-design/icons';
import './ProductPopup.css';
import Avatar from 'antd/lib/avatar/avatar';

const { Meta } = Card;

const notInterested = (idx) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: "NOT_INTERESTED", idx: idx });
  });
}

const viewProduct = (url) => {
  chrome.tabs.create({ url: url })
}

const ProductPopup = () => {
  const [products, setProducts] = React.useState([]);
  const [user, setUser] = React.useState({});
  useEffect(() => {
    const getData = async () => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "GET_PRODUCTS" }, function (response) {
          setProducts(response.products);
        });
      });

      chrome.runtime.sendMessage({ type: "GET_USER" }, (response) => {
        setUser(response);
      });
    }
    getData();
  }, []);

  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    console.log("received " + msg.type);
    switch (msg.type) {
      case "PRODUCTS_UPDATED":
        setProducts(msg.products);
        break;
      default:
        console.error("unrecognised message: ", msg);
    }
  });

  return (
    <div className="App">
      <header className="App-header">
        {
          products.length > 0 ?
            (
              <div>
                <p>Hi, {user.email}! We recognized these products which are available at BestBuy.ca</p>
                {
                  products.map(function (product, idx) {
                    return (
                      <Card
                        key={idx}
                        cover={
                          <img
                            alt="product image"
                            src={product.img}
                          />
                        }
                        actions={[
                          <CloseOutlined onClick={() => notInterested(idx)}></CloseOutlined>,
                          <ShoppingOutlined onClick={() => viewProduct(product.url)}></ShoppingOutlined>
                        ]}
                        className="Product-card">
                        <Meta
                          // avatar={<Avatar src={product.img} shape='square' size={100} />}
                          title={product.name}
                        />
                      </Card>
                    )
                  })
                }
              </div>
            )
            :
            (<p>Hi, {user.email}! No products found on this page. Check back later!</p>)
        }
      </header>
    </div >
  );
};

export default ProductPopup;
