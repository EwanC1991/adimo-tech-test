const cheerio = require("cheerio");
const axios = require("axios");
const fs = require('fs');



axios.get('https://cdn.adimo.co/clients/Adimo/test/index.html')
    .then(function (response) {
        // HTML is inside response.data
        let $ = cheerio.load(response.data);
        // Initialising the data structures that will contain the scraped data
        const items = [];
        const allPrices = [];

        $('div.item').each(function (i, elem) {
            // Extracting data of interest
            const name = $(elem).find('h1').text();
            const image = $(elem).find('img').attr("src");
            const price = $(elem).find('.price').text();
            let priceDifference = null;

            // Slice the string to remove the £
            let priceSlice = price.slice(1);
            // Convert the string into a float
            let priceFloat = parseFloat(priceSlice);
            // Check price is correct
            // console.log(priceFloat);
            // Push price into allPrices list
            allPrices.push(priceFloat);

            // Check Old Price isn't an empty string
            if ($(elem).find('.oldPrice') != '') {
                // Find the old Price
                let oldPrice = $(elem).find('.oldPrice').text();
                // Remove the £
                let oldPriceSlice = oldPrice.slice(1);
                // Parse the string to Float
                let oldPriceFloat = parseFloat(oldPriceSlice);
                // Calculate the difference in price
                priceDifference = priceFloat - oldPriceFloat;
            }


            // Filtering out uninteresting data
            if (name && price && image) {
                // Convert the data into a readable object
                const item = {
                    name: name,
                    image: image,
                    price: price,
                    priceDifference: priceDifference
                };

                // Adding the scraped data object to the items list
                items.push(item);
            }
        })

        // Add all the prices together to get the total value of all the items
        let totalValue = allPrices.reduce((sum, a) => sum + a, 0);

        // Check total value
        console.log(`Total Value: ${totalValue}`);

        // Calculate average price
        let averagePrice = totalValue / items.length;

        // Transforming the scraped data into a general object
        const scrapedData = {
            items: items,
            totalItems: items.length,
            averagePrice: "£" + averagePrice.toFixed(2)
        };

        // Check Scraped Data is correct
        // console.log(scrapedData)

        // Converting the scraped data object into JSON
        const scrapedDataJSON = JSON.stringify(scrapedData);

        // Console Log the final JSON output
        // console.log(scrapedDataJSON)

        // Writing the json file to local storage
        fs.writeFile("webscraper.json", scrapedDataJSON, function (err) {
            if (err) {
                return console.error(err);
            }
            console.log("File saved successfully!");
        })
    })
    .catch(function (error) {
        //Print error if any occured
        console.error('Error!: ', error.message)
    });