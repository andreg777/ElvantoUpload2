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
      const churchService = churchServices[0];
      //debugger;
      await this.addServiceWebUpload.uploadService(churchService);
      //debugger;
      await this.addVolunteersWebUpload.addServicePlan(churchService);
      //debugger;
    }
}

module.exports = ElvantoWebUpload;