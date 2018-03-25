const Navigator = require("./Navigation/Navigator");

function ElvantoWebUpload (page, churchServices)
{
    this.page = page;
    
    this.navigator = new Navigator(page);

    this.navigator.churchService

    this.uploadServices = function (churchService)
    {
        churchService.forEach(churchService => this.uploadService(churchService));
    }

    this.uploadService = function () 
    {
        this.navigator.gotoAddService();
    }
}

module.exports = ElvantoWebUpload;