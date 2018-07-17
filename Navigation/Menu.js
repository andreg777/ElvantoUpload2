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
		const options = {};
		await this.page.evaluate((options) =>
		{
			var elements = document.querySelectorAll('li a[href*=service_volunteers]');
			
			if (elements.length === 0)
			{
				console.log("volunteers button not found");
				return;
			}
			elements[0].click();

		},options);
	}
}

module.exports = Menu;
