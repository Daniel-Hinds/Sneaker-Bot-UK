const { info } = require('console');
const stockx = require('stockx-scraper');
const puppeteer = require('puppeteer');

const options = { //StockX API options
    currency: 'GBP', 
    country: 'US',
    //proxy: 'http://host:port@username:password',
}


function shoeInfo(shoeList){ //Fetch information from StockX about shoes
    stockx.getProduct(shoeList[0], options)
    .then((shoe) =>{
        console.log(shoe['name'])
        console.log(shoe['retail'])
    })
}



//shoeInfo(shoeList)

async function scrapeReleases(){ //Scrape for upcoming Nike Releases
    var shoeList = []

    var browser = await puppeteer.launch({headless: false, args: ['--window-size=1920,1080',],});
    const page = (await browser.pages())[0]; //access open page
    await page.goto('https://thesolesupplier.co.uk/release-dates/?brands%5B%5D=nike&sort=release_date_asc', { waitUntil: 'networkidle0' }); //Open TheSoleSupplier
    await page.waitForSelector('.product-result-card.card')
    
    const names = await page.$$('.card__header.card__header--product-link')
    console.log(names)

    //const elementName = await page.$('/html/body/div[2]/div/div/main/div/article/section[2]/div/div[2]/div[5]/div[1]/div/article[1]/a/section/div/header/h3/div')
    //const name = await page.evaluate(el => el.textContent, elementName)
    //console.log(name)
    
    
}
scrapeReleases()
///html/body/div[2]/div/div/main/div/article/section[2]/div/div[2]/div[5]/div[1]/div/article[1]/a/section/div/header/h3/div
///html/body/div[2]/div/div/main/div/article/section[2]/div/div[2]/div[5]/div[1]/div/article[2]/a/section/div/header/h3/div

///html/body/div[2]/div/div/main/div/article/section[2]/div/div[2]/div[5]/div[1]/div/article[1]/a/section/div/div/span[2]
///html/body/div[2]/div/div/main/div/article/section[2]/div/div[2]/div[5]/div[1]/div/article[2]/a/section/div/div/span[2]