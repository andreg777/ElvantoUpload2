const appConstants = require("../appConstants");

function Login (page)
{
    this.page = page;
    
	this.loginToClient = async function()
	{
	  await this.page.click('.user-login a');
      await this.page.type('#member_username',appConstants.username);	
      await this.page.type('#member_password', appConstants.password);	
      await this.page.click('.btn.btn-submit.btn-lg.btn-block');
	  await page.waitFor(2000);
	  await this.page.click('a.dropdown-toggle');
	  await this.page.click('.dropdown-menu [href=\\/admin\\/]');
	  await page.waitFor(1000);
	}	
}

module.exports = Login;
