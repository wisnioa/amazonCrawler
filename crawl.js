const puppeteer = require('puppeteer');
var fs = require("fs");


let crawlAmazon = async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('http://amazon.com/');
    await page.type('#twotabsearchtextbox', 'novels');
    await page.click('input.nav-input');
    await page.waitForSelector('#resultsCol');
    await page.waitFor(1000);

    const searchBooks = await page.evaluate(() => {

        let bookData = []; // Create an empty array that will store data
        let elements = document.querySelectorAll('.s-result-item'); // Select all book results

        //Loop through the results 
        elements.forEach(element => {
            try {
                let title = element.querySelector('div > div > div > div > div > a[title]').innerText; //Get the book title
                let author = element.querySelector('div > div > div > div > div > div > span > a.a-link-normal.a-text-normal').innerText; //Get the author
                let currency = element.querySelector('sup.sx-price-currency').innerText; //Get the currency type
                let price = element.querySelector('span.sx-price-whole').innerText; // Get the price
                let fractNum = document.querySelector('sup.sx-price-fractional').innerText; //Get the cents
                let bookType = document.querySelector('div > div > div > div > div > div > div > a > h3[data-attribute]').innerText; //Get book type
                let total = currency + price + '.' + fractNum;


                bookData.push({
                    book: {
                        title,
                        author,
                        total,
                        bookType
                    }

                }); // Push an object with the data into our array
            }
            catch (err) {
                console.error(err);
            }
        })
        // Return book data array  
        return JSON.stringify(bookData, null, 2);
    });


    return searchBooks; // Return the result
    await browser.close();

};

crawlAmazon().then((response) => {
    console.log(response);
    fs.writeFile("books.json", response, function(err) {

 
        if (err) {
          return console.log(err);
        }
      
   
        console.log("books.json was updated!");
      
      });
});




