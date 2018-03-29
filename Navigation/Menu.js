const appConstants = require("../appConstants");


function Menu(page)
{
	this.page = page;
	
	this.clickServices = async function()
	{
		await this.page.click('[href=\\/admin\\/services\\/]');
	}
	
	
	this.gotoAddService = async function ()
	{
		await page.goto(appConstants.addServicesUrl);	
	}

	this.gotoAddVolunteers = async function()
	{
		await this.page.click('[href *= \\/admin\\/services\\/service_volunteers]')
	}
}

module.exports = Menu;
