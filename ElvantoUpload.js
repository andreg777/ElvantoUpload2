//npm install -g node-inspector //node-debug app.js

const puppeteer = require('puppeteer'); 
const xlsx = require('xlsx');
const Navigator = require("./Navigation/Navigator");
const ExcelRosterExtract = require("./ExcelRosterExtract");
const ElvantoWebUpload = require("./WebUpload/ElvantoWebUpload");

(async () => {

  try{
    const rosterExctract = new ExcelRosterExtract();

    const churchServices = await rosterExctract.readData();
    
    const browser = await puppeteer.launch({headless: false, slowMo:30});
  
    const page = await browser.newPage();
    
    //await page.setViewport({ width: 1366, height: 768});
    
    const navigator = new Navigator(page);
    
    await navigator.gotoApplication();
    
    await navigator.login.loginToClient();
    
    const webUpload = new ElvantoWebUpload(page);
  
    //debugger;

    await webUpload.process(churchServices);
  
    //debugger;
    
    //await browser.close(); 
  
  }catch(e)
  {
    var message = e.message;
    console.log(message);
    //console.log(e.toString())
  }

})();