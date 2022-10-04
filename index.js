const {worker, workerData, isMainThread} = require('worker_threads');
const { Page } = require('puppeteer');
const puppeteer = require('puppeteer-extra');
const sleep = require('sleep-promise');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

//localStorage.clear();
//console.log("Cleared local storage");

console.log(isMainThread)

global.keyword = "";
global.proxy = 0;
global.proxyActive = "";
global.sneakerLinks = [];
global.testMode = false;
global.password = "";
global.username = "";
global.shoeSize = 1;
global.cardCVV = "";
global.instances = 0;
global.currentRunningTasks = 1;
global.email = ""
global.activeDivs = [];
global.number = 0
global.time = -1;

//SETUP WIZARD STUFF

//CHANGE PAGES
function welcome_next(){
    window.location.replace("login.html"); //next page
};
function setings(){
    window.location.replace("settings.html"); //next page
}
function home(){
    window.location.replace("index.html"); //next page
}

async function loginWizard(){
    function getChromiumExecPath() {
        return puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked');
    }
    //hide login show spinner
    document.getElementById("login-wizard").style.display="none"; //show in
    document.getElementById("loading").style.display="inline-block"; //show in
    //login and check correct
    email = document.getElementById('email').value;
    password = document.getElementById('password').value;

    //login
    var browser = await puppeteer.launch({headless: false, executablePath: getChromiumExecPath(), args: ['--window-size=1920,1080',],});
    const page = (await browser.pages())[0]; //access open page
    await page.goto('https://nike.com/gb/login'); //open website
    await sleep(2000);
    await page.waitForSelector('.ncss-btn-primary-dark.pt3-sm.pb3-sm.pt2-lg.pb2-lg.ta-sm-c.u-full-width');//wait for popup cookies window
    await page.click('.ncss-btn-primary-dark.pt3-sm.pb3-sm.pt2-lg.pb2-lg.ta-sm-c.u-full-width'); //press cookies 

    await sleep(1000);
	await page.focus('.emailAddress > input');
	await page.keyboard.type(email);
	await page.waitFor(200);
			
	await page.focus('.password > input')
	await page.keyboard.type(password);
	await page.waitFor(200);
			
	await page.evaluate(() =>
		document.querySelectorAll(".loginSubmit > input")[0].click()
	);

    //check login was successful
    try {
        await page.waitForSelector(".grid-col.va-sm-t.ncss-col-lg-12.ncss-col-md-12.ncss-col-sm-12.ncss-col-lg-offset-0.ncss-col-md-offset-0.ncss-col-sm-offset-0", {timout: 15000})  //if successful
        console.log("Successful login!")
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
        window.location.replace("index.html"); //next page
    } catch {
        console.log("Failed login!")
        document.getElementById("failed").style.display="block"; //show info
        document.getElementById("loading").style.display="none"; //
    }
}


//ON INITIAL PAGE LOAD
function task_page_load(){

    //login stuff
    if (localStorage.getItem("email") != null) {
        document.getElementById("login-none").style.display="none"; //hide input fields
        document.getElementById("login-save").style.display="block"; //show info

        email = localStorage.getItem("email");
        password = localStorage.getItem("password");
        document.getElementById("email-save").innerHTML = email;
    }
    else if (localStorage.getItem("username") == null) {
        console.log("No login info found");
    }

    //Card CVV
    if (localStorage.getItem("cardCVV") != null) {
        cardCVV = localStorage.getItem("cardCVV");
        document.getElementById("cvvCode").innerHTML=cardCVV
        document.getElementById("cvvReset").style.display="block";
        document.getElementById("cvvSave").style.display="none";
        document.getElementById("cvv").style.display="none";
    }
    else if (localStorage.getItem("cardCVV") == null) {
        document.getElementById("cvvReset").style.display="none";
    }

    //proxy stuff
    if (localStorage.getItem("proxy_address") != null) { //if proxy address is saved in storage
        proxy = localStorage.getItem("proxy_address");
        document.getElementById("proxy_active").innerHTML = "Active"; //set label active
        proxyActive = true;

        document.getElementById("proxy_address_is").innerHTML = proxy; //set label to proxy
        document.getElementById("save_proxy").style.display="none";
    }
    else if (localStorage.getItem("proxy_address") == null) {  //if proxy is not saved in storage
        document.getElementById("proxy_active").innerHTML = "Disabled";
        document.getElementById("proxy_address_stuff").style.display="none"; //set div visible
        document.getElementById("proxy-input").style.display="block"; //set input visible
        document.getElementById("reset_proxy").style.display="none"; //set reset button invisible
        proxyActive = false;
    }
}

function page_load() {
    //login stuff
    if (localStorage.getItem("email") != null) {
        document.getElementById("login-none").style.display="none"; //hide input fields
        document.getElementById("login-save").style.display="block"; //show info

        email = localStorage.getItem("email");
        password = localStorage.getItem("password");
        document.getElementById("email-save").innerHTML = email;
    }
    else if (localStorage.getItem("username") == null) {
        console.log("No login info found");
    }
}
//instructions
function instructions(){
    require("electron").shell.openExternal("Guide.pdf");
}

//CVV
function cardCVVsave(){
    cardCVV = document.getElementById("cvv").value;
    localStorage.setItem("cardCVV", cardCVV);
    document.getElementById("cvvSave").style.display="none";
    document.getElementById("cvv").style.display="none";
    document.getElementById("cvvReset").style.display="block";
    document.getElementById("cvvCode").innerHTML = cardCVV;
}
function cardCVVreset(){
    document.getElementById("cvvSave").style.display="block";
    document.getElementById("cvv").style.display="block";
    document.getElementById("cvvReset").style.display="none";
    document.getElementById("cvvCode").innerHTML="";
}

//LOGIN STUFF
function loginDetails(){
    email = document.getElementById('email').value;
    password = document.getElementById('password').value;

    localStorage.setItem("email", email);
    localStorage.setItem("password", password);

    document.getElementById("login-none").style.display="none"; //hide input fields
    document.getElementById("login-save").style.display="block"; //show info
    document.getElementById("email-save").innerHTML = email;
}
function updateLoginInformation() {
    document.getElementById("login-none").style.display="block"; //hide input fields
    document.getElementById("login-save").style.display="none"; //show info
}

//PROXY SETTINGS
function saveProxy () { //update proxy settings
    proxy = document.getElementById('proxy-input').value;
    localStorage.setItem("proxy_address", proxy);
    document.getElementById("proxy_address_is").innerHTML = proxy; //set label to proxy
    document.getElementById("proxy-input").style.display="none"; //set input invisible
    document.getElementById("proxy_active").innerHTML = "Active"; //set label active
    document.getElementById("proxy_address_stuff").style.display="block"; //set div visible
    document.getElementById("save_proxy").style.display="none";
    document.getElementById("reset_proxy").style.display="block"; //set reset button visible


    console.log("Proxy Address has been set to:", proxy)
}
function resetProxy () { //reset proxy settings
    localStorage.removeItem("proxy_address"); //remove local storage
    document.getElementById("proxy_active").innerHTML = "Disabled"; //set disabled
    document.getElementById("proxy_address_stuff").style.display="none"; //set div invisible
    document.getElementById("proxy-input").style.display="block"; //set input visible
    document.getElementById("save_proxy").style.display="block"; //set save button visibile
    document.getElementById("reset_proxy").style.display="none"; //set reset button invisible
}

//Start script button stuff
function changeColour(){   //changes background colour when script starts
    document.body.style.backgroundColor= "red";
}

//KEYWORD stuff
function updateKeyword () {
    keyword = document.getElementById('keyword').value;
}

//Testing mode stuff
function toggleTest(){
    document.getElementById("test-mode").innerHTML = "True"; //set label true
    testMode = true;
}

//Shoe Size Select
function shoeSizeFunction(){
    shoeSize = document.getElementById("shoe-size").value; 
}

//Number of tasks
function tasks(){
    instances = document.getElementById("tasks").value;
}
//START TIME STUFF
function startNow(){
    startNowBool = document.getElementById("startNow").checked;
    if (startNowBool == true){
        document.getElementById("time").style.display="none"; //set input invisible
        time = false;
    }
    if (startNowBool == false){
        document.getElementById("time").style.display="inline-block"; //set input visible
    }
}
function startTime(){
    badTime = document.getElementById("time").value;
    time = badTime.split(":")
}

//MAIN SCRIPT FUNCTIONS


//RUNNING TASKS
function newRunningTask(){
    shoeSizeUK = [5.5,6,6.5,7,7,5,8,8.5,9,9.5,10,10.5,11,11.5,12,13,14]
    shoeSizeActual = shoeSizeUK[shoeSize-1]
    if (proxyActive == true) {
        var prox = "Active"
    }
    else if (proxyActive != true){
        var prox = "Disabled"
    }
    var div = document.createElement('div');
    var innerHTMLtask = `<table> 
                            <tr> 
                                <th>Keyword</th> <th>Size</th> <th>Proxy</th> <th>Status</th>
                            </tr>
                            <tr> 
                                <td>${keyword}</td> <td>${shoeSizeActual}</td> <td>${prox}</td> <td id="status${number}">Loading</td>
                            </tr> 
                        </table>`
    div.innerHTML = innerHTMLtask; //inner html stuff

    div.setAttribute('class', 'runningDiv'); // and make sure myclass has some styles in css
    document.getElementsByClassName("running-tasks")[0].appendChild(div);

    //BR
    var br = document.createElement('div');
    var innerHTMLtask = '<br>'
    br.innerHTML = innerHTMLtask; //inner html stuff
    document.getElementsByClassName("running-tasks")[0].appendChild(br);

    currentRunningTasks = currentRunningTasks + 1;
    document.getElementById("running-tasks").innerHTML = (currentRunningTasks-1);
}

async function buySneakers(){
    if (keyword == ""){
        alert("NO KEYWORD! Please enter a keyword for the shoes you are trying to cop before continuing.")
        return
    }
    if (time == -1){
        alert("SELECT A START TIME! Please select a time to start the scripts or tick the box to start instantly.")
        return
    }
    if (instances == 0){
        alert("NO TASKS! Please select how many tasks to run.")
        return
    }
    if (email == ""){
        alert("NO EMAIL ADDRESS! Please update login information with an email.")
        return
    }
    if (password == ""){
        alert("NO PASSWORD! Please update login information with a password.")
        return
    }
    if (cardCVV == ""){
        alert("NO CVV! Please update card CVV number.")
        return
    }


    for (let count = 0; count < instances; count++){
        newRunningTask();
        const worker = new Worker('./worker.js');
        worker.postMessage([
            number, 
            keyword, 
            proxy,
            proxyActive, 
            sneakerLinks, 
            testMode, 
            password, 
            email, 
            shoeSize, 
            cardCVV,
            time]);
    }
    number = number + 1
}


//UI


function updateStatus() {
    divNum = 0;
    document.getElementById(`status${divNum}`).innerHTML = "Active";
}