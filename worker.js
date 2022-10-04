const {parentPort, workerData, isMainThread, worker} = require('worker_threads');
const { Page } = require('puppeteer');
const puppeteer = require('puppeteer-extra');
const sleep = require('sleep-promise');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

function getChromiumExecPath() {
    return puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked');
}


async function start(){
    if (proxyActive == true) {
        var browser = await puppeteer.launch({headless: false, executablePath: getChromiumExecPath(), args: ['--window-size=1920,1080', `--proxy-server=https=${proxy}`],}); //open browser with proxy
    }
    else if (proxyActive == false) {
        var browser = await puppeteer.launch({headless: false, executablePath: getChromiumExecPath(), args: ['--window-size=1920,1080',],}); //open browser without proxy
    };

    const page = (await browser.pages())[0]; //access open page

    await page.goto('https://twitter.com/nikestore/'); //open twitter website
    await sleep(5000);

    console.log("Searching for keyword: ", keyword);
    while (0==0){
        const innerTextTwitter = await page.evaluate(() => document.querySelector('.css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci.r-kzbkwu').innerText); //fetch text
        foundKeyword = innerTextTwitter.split(" ").includes(keyword);

        const time = await page.evaluate(() => document.querySelector('.css-4rbku5.css-18t94o4.css-901oao.r-1bwzh9t.r-1loqt21.r-1q142lx.r-37j5jr.r-a023e6.r-16dba41.r-rjixqe.r-bcqeeo.r-3s2u2q.r-qvutc0').innerText); //fetch text
        if (foundKeyword == true) {
            if (time.includes('s') == true){
                console.log("Found keyword")
                await page.click(".css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci.r-kzbkwu") //press tweet
                const allLinks = await page.$$('.css-4rbku5');
                await sleep(1000);

                for (let i = 0; i < allLinks.length; i++) {
                    const oneLink = await (await allLinks[i].getProperty('innerText')).jsonValue(); //get text link
                    partLink = oneLink.substring(0,19); 

                    if (partLink == "https://go.nike.com") {
                        sneakerLinks.push(oneLink) //add link to array
                    }
                }

                break;
            }else {
                console.log("Did not find keyword!")
                await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] })
            }
        }
        else {
            console.log("Did not find keyword!")
            await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] })
        }
    }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //document.getElementById("start-checkout").innerHTML = "True";   //Update list
    console.log("Using Proxy: ",proxyActive);
    console.log("Test mode:", testMode);
    console.log("Email:", email);
    console.log("Shoe size:", shoeSize);
    console.log("Starting checkout!");

    await page.goto('https://nike.com/gb/login'); //open website

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    await page.setRequestInterception(true) //block images
    page.on('request', (request) => {
    if (request.resourceType() === 'image') request.abort()
    else request.continue()
    })


    await page.waitForSelector('.ncss-btn-primary-dark.pt3-sm.pb3-sm.pt2-lg.pb2-lg.ta-sm-c.u-full-width');//wait for popup cookies window
    await page.click('.ncss-btn-primary-dark.pt3-sm.pb3-sm.pt2-lg.pb2-lg.ta-sm-c.u-full-width'); //press cookies 

    await sleep(1000);
    // Username
	await page.focus('.emailAddress > input');
	await page.keyboard.type(email);
	await page.waitFor(200);
			
		// Password
	await page.focus('.password > input')
	await page.keyboard.type(password);
	await page.waitFor(200);
			
		// Submit
	await page.evaluate(() =>
		document.querySelectorAll(".loginSubmit > input")[0].click()
	);

    await sleep(5000);

    await page.goto(sneakerLinks[0]);

    //check if item exists and if not refresh
    while (true) {
        const exists = !!(await page.$('.buying-tools-container'));
        if (exists == true) {
            break
        }
        else {
            await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
            console.log("Reloading page!")
        }
        const nikeApp = !!(await page.$(".grid.Z25uR9U5.fixed-fluid.ncss-container._1WKaQgke.css-8fcif.css-1wf7v22")) //nike app exclusive
        if (nikeApp == true) {
            console.log("Cannot buy - exclusive to nike app")
        }
    };
    console.log("In stock, now checkout out!");
    await page.evaluate( () => {  //scroll down a bit
        window.scrollBy(0, 750);
    });

    var shoeSizeXpath = "/html/body/div[2]/div/div/div[1]/div/div[1]/div[2]/div/section/div[2]/aside/div/div[2]/div/div[2]/ul/li["+ shoeSize +"]/button"
    const shoeSizeSelect = await page.$x(shoeSizeXpath); //select shoes size
    await shoeSizeSelect[0].click();      

    await sleep(500);
    const addToBasket = await page.$x('/html/body/div[2]/div/div/div[1]/div/div[1]/div[2]/div/section[1]/div[2]/aside/div/div[2]/div/div[2]/div/button');   //select add to basket element
    await addToBasket[0].click(); //press add to basket
    await sleep(1000)

    await Promise.all([
        page.goto('https://nike.com/gb/cart'), //open cart
        page.waitForNavigation()//wait for page to load
    ]);
    await sleep(500);
    
    await Promise.all([
        page.goto('https://nike.com/gb/checkout'), //checkout
        page.waitForNavigation()//wait for page to load
    ]);


    //Iframe stuff
    await page.waitForSelector('.cvv-form.ncss-container.ncss-input-container.pl5-sm.pt5-sm.pr5-sm.pb0-sm');//wait for login page iframe

    await page.evaluate( () => {  //scroll to bottom of page
        window.scrollBy(0, window.innerHeight);
    });

    await sleep(600);

    const frame = page.frames().find(f => f.url().startsWith('https://paymentcc.nike.com/services/cvv')); //navigate into iframe
    await sleep(100);
    const security = await frame.$x('/html/body/form/div/input'); //Select card security input field
    await security[0].type("288");

    await sleep(500);
    const orderReview = await page.$x('/html/body/div[1]/div/div[3]/div/div[2]/div/div/main/section[3]/div/div[1]/div[2]/div[5]/button'); //select order review 
    await orderReview[0].click(); //click button 

    //await sleep(1000);
    await page.waitForSelector('.d-lg-ib.d-sm-h.fs14-sm.ncss-brand.ncss-btn-accent.pb2-lg.pb3-sm.prl5-sm.pt2-lg.pt3-sm.u-uppercase');//wait for confirm order button
    const order = await page.$x('/html/body/div[1]/div/div[3]/div/div[2]/div/div/main/section[4]/div/div/div/div/section[2]/div/button'); //Confirm purchase
    if (testMode == true){
        await order[0].click();
        console.log("Bought you some sneakers!")
        //document.getElementById("bought").innerHTML = "True";   //Update list
    }
    else {
        console.log("Test complete!")
    }
    
}

addEventListener("message", event => {
    [number, keyword, proxy, proxyActive, sneakerLinks, testMode, password, email, shoeSize, cardCVV, time] = event.data;
    if (time != false){
        setInterval(function(){
            var date = new Date();
            if(date.getHours() === Number(time[0]) && date.getMinutes() === Number(time[1])){
                start()
            }
        }, 30000);
    }
    else if (time == false){
        start()
    }
});

