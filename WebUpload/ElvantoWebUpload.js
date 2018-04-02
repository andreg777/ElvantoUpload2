const Navigator = require("../Navigation/Navigator");
const AddServiceWebUpload = require("./AddServiceWebUpload");
const AddVolunteersWebUpload = require("./AddVolunteersWebUpload");

function ElvantoWebUpload (page)
{
    this.page = page;

    this.addServiceWebUpload = new AddServiceWebUpload(page);
    this.addVolunteersWebUpload = new AddVolunteersWebUpload(page);

    this.process = async function (churchServices)
    {
      churchServices.forEach(async churchService =>
      {
        debugger;
        
        await this.addServiceWebUpload.uploadService(churchService);

        await this.addVolunteersWebUpload.addServicePlan(churchService);
  
      });
    }
}

module.exports = ElvantoWebUpload;