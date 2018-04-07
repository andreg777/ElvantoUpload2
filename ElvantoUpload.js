//npm install -g node-inspector //node-debug app.js

const puppeteer = require('puppeteer'); 
const xlsx = require('xlsx');
const Navigator = require("./Navigation/Navigator");
const ExcelRosterExtract = require("./ExcelRosterExtract");
const ElvantoWebUpload = require("./WebUpload/ElvantoWebUpload");

(async () => {

  try
  {
    const rosterExctract = new ExcelRosterExtract();

    const churchServices = await rosterExctract.readData();
    
    const browser = await puppeteer.launch({ headless: false, slowMo:50 });
  
    const page = await browser.newPage();

    const navigator = new Navigator(page);
    
    await navigator.gotoApplication();
    
    await navigator.login.loginToClient();
    
    const webUpload = new ElvantoWebUpload(page);
  
    await webUpload.process(churchServices);

    console.log("complete");
  }
  catch(e)
  {
    var message = e.message;
    debugger;
    console.log(message);
  }

})();