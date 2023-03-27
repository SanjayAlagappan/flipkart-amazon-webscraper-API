  const express = require('express');
  const cors = require('cors');
  const axios = require('axios');
  const cheerio = require('cheerio');

  const app = express();
  console.log(app);
  app.use(cors());

  app.get('/api/search/:product', async (req, res) => {
    const product = decodeURI(req.params.product);
    const amazonUrl = `https://www.amazon.in/s?k=${product}&ds=v1%3A4aWwqwdBzOMuU%2FsDWdOcUmnB0DDFo7yjoxlrz56Rusk`;
  const flipkartUrl = `https://www.flipkart.com/search?q=${product}&p%5B%5D=facets.fulfilled_by%255B%255D%3DPlus%2B%2528FAssured%2529`;

    let response = {};

    try {
      
      // Fetching data from Flipkart
      const flipkartData = await axios.get(flipkartUrl);
      const flipkartHtml = flipkartData.data;
      const $flipkart = cheerio.load(flipkartHtml);
      const flipkartImage = $flipkart('._396cs4').first().attr('src');
      const flipkartProduct_desc=$flipkart('._4rR01T').first().text();
      const flipkartRating= $flipkart('div._3LWZlK').first().text();
      const flipkartLink = $flipkart('a._1fQZEK').first().attr('href');
      const flipkartPrice = $flipkart('div._30jeq3._1_WHN1').first().text();
      response.flipkart = {
        site: 'Flipkart',
        link: `https://www.flipkart.com${flipkartLink}`,
        desc: product,
        rating:flipkartRating,
        image:flipkartImage,
        price: flipkartPrice,
      };
      
      // Fetching data from Amazon
      const amazonData = await axios.get(amazonUrl);
      const amazonHtml = amazonData.data;
      const $ = cheerio.load(amazonHtml);
      const amazonImage = $('img.s-image').first().attr('src');
      const amazonLink = $('a.a-link-normal.a-text-normal').first().attr('href');
      var amazonRating=$('span.a-size-base').first().text();
      if(amazonRating==="Search instead for ")
      {
        amazonRating= "4.5";
      }
      const amazonPrice = $('span.a-price-whole').first().text();
      response.amazon = {
        site: 'Amazon',
        link: `https://www.amazon.in/${amazonLink}`,
        rating:amazonRating,
        image:flipkartImage,
        price: amazonPrice,
      };
      // Determining the best site to buy from
      const amazonPriceInt = parseInt(amazonPrice.replace(',', '').trim());

      const flipkartPriceInt = parseInt(flipkartPrice.replace(',', '').trim());
      if (amazonPriceInt < flipkartPriceInt) {
        response.bestSite = 'Amazon';
      } else {
        response.bestSite = 'Flipkart';
      }

      res.send(response);
    } catch (error) {
      console.log("Error starts here!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      
      res.status(500).send(error.message);
      console.error(error); 

    }
  });

  app.listen(3001, () => {
    console.log(`Server running on port 3001`);
  });
