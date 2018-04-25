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
      try
      {
        for(let churchService of churchServices)
        {
          console.log(`starting upload for service ${churchService.churchType.name}`);
          
          await this.addServiceWebUpload.createService(churchService);
          
          await this.addVolunteersWebUpload.addVolunteers(churchService);    
        }
      }
      catch(e)
      {
        console.log("error processing churchservice")
        console.log(e);
      }


      return;

      for (let churchService of churchServices)
      {
        try
        {
          await this.addServiceWebUpload.createService(churchService);
          await this.addVolunteersWebUpload.addVolunteers(churchService);
        }
        catch(e)
        {
          debugger;
          console.log(e.message);
        }
      }
    }
}

module.exports = ElvantoWebUpload;