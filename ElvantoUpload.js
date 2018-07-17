//npm install -g node-inspector //node-debug app.js

const puppeteer = require('puppeteer'); 
const xlsx = require('xlsx');
const Navigator = require("./Navigation/Navigator");
const ExcelRosterExtract = require("./ExcelRosterExtract");
const ElvantoWebUpload = require("./WebUpload/ElvantoWebUpload");
const appConstants = require("./appConstants");

(async () => {

  try
  {
    console.clear();

    const rosterExctract = new ExcelRosterExtract();

    const churchServices = await rosterExctract.readData();
    
    const browser = await puppeteer.launch(
      {
        headless: false, 
        slowMo: appConstants.slowMo,
        executablePath: appConstants.exePath,
        //args: ['--window-size=3500,2000']
        args: ['--start-fullscreen']
      });
  
    const page = await browser.newPage();
    
    await page.setViewport({width: 2400, height: 1000});
  
    page.on('console', msg => {
      //debugger;
      if(msg._text)
      {
        if(msg._text.indexOf)
        {
          if(msg._text.indexOf("Wootric") >= 0)
          {
            return;
          }
        }
      }
      console.log(msg._text);
    });
  
    const navigator = new Navigator(page);
    
    await navigator.gotoApplication();
    
    await navigator.login.loginToClient();
    
    const webUpload = new ElvantoWebUpload(page);
  
    await webUpload.process(churchServices);

    console.log("upload complete");
  }
  catch(e)
  {
    var message = e.message;
    console.log("error:");
    console.log(message);
  }

})();