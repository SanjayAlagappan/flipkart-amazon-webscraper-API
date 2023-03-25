const axios = require('axios');

const searchAmazon = async (query) => {
  const response = await axios.get(`https://www.amazon.in/s?k=${query}`);
  // parse the HTML response and extract the product data
  // return an array of products
};

const searchFlipkart = async (query) => {
  const response = await axios.get(`https://www.flipkart.com/search?q=${query}`);
  // parse the HTML response and extract the product data
  // return an array of products
};

const searchSnapdeal = async (query) => {
  const response = await axios.get(`https://www.jiomart.com/search/${query}`);
  // parse the HTML response and extract the product data
  // return an array of products
};

module.exports = {
  searchAmazon,
  searchFlipkart,
  searchSnapdeal,
};