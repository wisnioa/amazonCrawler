const puppeteer = require('puppeteer');
const fs = require("fs");

//Beginning the scrape
let crawlAmazon = async () => {

    //Launching the browser
    const browser = await puppeteer.launch({ headless: false });

    //Opening new page
    const page = await browser.newPage();

    //Going to Amazon
    await page.goto('http://amazon.com/');

    //Typing novels in the search bar
    await page.type('#twotabsearchtextbox', 'novels');

    //Clicking the search button
    await page.click('input.nav-input');

    //Waiting for the resultsCol ID to show up 
    await page.waitForSelector('#resultsCol');


    await page.waitFor(3000);

    //Telling puppeteer to evaluate the page, beginning of actual of scrape logic. 
    const searchBooks = await page.evaluate(() => {

        // Create an empty array that will store data
        let bookData = []; 

        // Select all book results
        let elements = document.querySelectorAll('.s-result-item'); 

        let id = 0;
        //Loop through the results 
        for (let element of elements) {
            try {
               
                id++
                //Get the book title
                let title = element.querySelector('div > div > div > div > div > a[title]').innerText; 
                //Get the author
                let author = element.querySelector('div > div > div > div > div > div > span > a.a-link-normal.a-text-normal').innerText; 
                //Get the currency type
                let currency = element.querySelector('sup.sx-price-currency').innerText; 
                // Get the price
                let price = element.querySelector('span.sx-price-whole').innerText; 
                //Get the cents
                let fractNum = document.querySelector('sup.sx-price-fractional').innerText;
                //Get book type
                let bookType = document.querySelector('div > div > div > div > div > div > div > a > h3[data-attribute]').innerText; 
                //Adding all together into one variable to put in the object
                let total = currency + price + '.' + fractNum; 
                
                // Push an object with the data into book array
                bookData.push({
                    book: {
                        id,
                        title,
                        author,
                        total,
                        bookType
                    }

                }); 
            }
            catch (err) {
                console.error(err);
            }
        }
        // Return book data array  
        return JSON.stringify(bookData, null, 2);
    });


    return searchBooks; // Return the result of page evaluation 
    await browser.close(); //Close the browser

};

//Calling scrape function to run
crawlAmazon().then((response) => {
    console.log(response);

    //Putting results of scrape into a JSON file
    fs.writeFile("books.json", response, function(err) {

 
        if (err) {
          return console.log(err);
        }
      
   
        console.log("books.json was updated!");
      
      });
});




