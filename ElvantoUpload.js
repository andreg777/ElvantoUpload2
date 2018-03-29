//npm install -g node-inspector //node-debug app.js

const puppeteer = require('puppeteer'); 
const xlsx = require('xlsx');
const Navigator = require("./Navigation/Navigator");
const ExcelRosterExtract = require("./ExcelRosterExtract");
const ElvantoWebUpload = require("./WebUpload/ElvantoWebUpload");

(async () => {

  const rosterExctract = new ExcelRosterExtract();

  const churchServices = await rosterExctract.readData();
  
  const browser = await puppeteer.launch({headless: false, slowMo:30});

  const page = await browser.newPage();
  
  //await page.setViewport({ width: 1366, height: 768});
  
  const navigator = new Navigator(page);
  
  await navigator.gotoApplication();
	
  await navigator.login.loginToClient();
  
  const webUpload = new ElvantoWebUpload(page);

  await webUpload.process(churchServices);

  //await browser.close(); 

})();