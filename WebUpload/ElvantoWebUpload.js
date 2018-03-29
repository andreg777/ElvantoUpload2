const Navigator = require("../Navigation/Navigator");
const AddServiceWebUpload = require("./AddServiceWebUpload");

function ElvantoWebUpload (page)
{
    this.page = page;

    this.addServiceWebUpload = new AddServiceWebUpload(page);

    this.process = async function (churchServices)
    {
      const churchService = churchServices[0];
      this.addServiceWebUpload.uploadService(churchService);      
    }    
}

module.exports = ElvantoWebUpload;