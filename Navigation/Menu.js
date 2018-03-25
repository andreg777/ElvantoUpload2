const appConstants = require("../appConstants");


function Menu(page)
{
	this.page = page;
	
	this.clickServices = async function()
	{
		await this.page.click('[href=\\/admin\\/services\\/]');
	}
	
	this.hoverServices = async function()
	{
		await this.page.hover('[href=\\/admin\\/services\\/]');
	}
	
	this.clickAddService = async function ()
	{
		await page.click('[href=\\/admin\\/services\\/add_service\\/]');
	}
}

module.exports = Menu;
