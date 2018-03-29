const appConstants = require("../appConstants");
const Login = require("./Login");
const Menu = require("./Menu");

function Navigator(page)
{
	this.page = page;
	
	this.login = new Login(page);	
	
	this.menu = new Menu(page);
	
  this.gotoApplication = async function()
	{
	  await page.goto(appConstants.applicationUrl);
	}
	
	this.gotoAddService = async function ()
	{
	  await this.menu.gotoAddService();
	}

	this.gotoAddVolunteers = async function()
	{
		await this.menu.gotoAddVolunteers();	
	}
}

module.exports = Navigator;