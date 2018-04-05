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
	  await page.waitFor(appConstants.loadingDelay);
	  await this.page.click('a.dropdown-toggle');
	  await this.page.click('.dropdown-menu [href=\\/admin\\/]');
	  await page.waitFor(appConstants.loadingDelay);
	}	
}

module.exports = Login;
