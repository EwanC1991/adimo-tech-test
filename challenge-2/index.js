const cheerio = require("cheerio");
const axios = require("axios");
const fs = require('fs');
const prompt = require('prompt-sync')();

// As explained in the email I was unable to get axios to fetch 
// on the Whiskey Exchange without receiving a 403 error.

// If I were able to get this to work then I would have used 
// prompt-sync to ask the user for a search term.

const searchTerm = prompt("What would you like to search? : ");

// To show the prompt works for added a search term
console.log(`https://www.thewhiskyexchange.com/search?q=${searchTerm}`);


// This is where axios would do the search on the Whiskey Exchange

// axios.get(`https://www.thewhiskyexchange.com/search?q=${searchTerm}`)
//     .then(function (response) {

// HTML is inside response.data
let $ = cheerio.load(fs.readFileSync('whiskey-exchange-beer.html'));
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

// Writing the json file to local storage
fs.writeFile("challenge-2.json", scrapedDataJSON, function (err) {
    if (err) {
        return console.error(err);
    }
    console.log("File saved successfully!");
});