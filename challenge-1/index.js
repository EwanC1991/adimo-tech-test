const cheerio = require("cheerio");
const axios = require("axios");
const fs = require('fs');

// As explained in the submission email I was getting the 403 error when trying to fetch the data from the Whiskey Exchange
// So I downloaded the html of the search page and loaded it into Cheerio to show that the logic of my code works


// This is where Axios would do the fetch on the Whiskey Exchange link

// axios.get('https://www.thewhiskyexchange.com/search?q=cider')
//     .then(function (response) {
// HTML is inside response.data
let $ = cheerio.load(fs.readFileSync('whiskey-exchange-cider.html'));
// Initialising the data structures that will contain the scraped data
const items = [];
const allPrices = [];

$('li.product-grid__item').each(function (i, elem) {
    // Extracting data of interest
    const name = $(elem).find('.product-card__name').text();
    const image = $(elem).find('img').attr("src");
    const price = $(elem).find('.product-card__price').text();

    // Filtering out uninteresting data
    if (name && price && image) {
        // Convert the data into a readable object
        const item = {
            name: name,
            image: image,
            price: price
        };
        // Trim the spaces from each side of the price
        let priceTrim = price.trim();
        // Slice the string to remove the £
        let priceSlice = priceTrim.slice(1);
        // Convert the string into a float
        let priceFloat = parseFloat(priceSlice);
        // Check price is correct
        console.log(priceFloat);
        // Push price into allPrices list
        allPrices.push(priceFloat);

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
    averagePrice: `£${averagePrice.toFixed(2)}`
};

// Check Scraped Data is correct
console.log(scrapedData);

// Converting the scraped data object into JSON
const scrapedDataJSON = JSON.stringify(scrapedData);

// Console Log the final JSON output
console.log(scrapedDataJSON);

// Writing the json file to local storage, this will be overwritten each time the scraper is used
fs.writeFile("challenge-1.json", scrapedDataJSON, function (err) {
    if (err) {
        return console.error(err);
    }
    console.log("File saved successfully!");
});