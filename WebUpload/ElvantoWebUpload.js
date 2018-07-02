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
        var startTime = new Date();

        churchServices.sort((a, b) => 
        {
          if(a.date > b.date)
          {
              return 1;
          }
          else if(a.date < b.date)
          {
              return -1;
          }
          return 0;
        });
        
        for(let churchService of churchServices)
        {
          console.log("----------------------------------------------------")
          console.log(`starting upload for service ${churchService.churchType.name} ${churchService.date.getDate()}/${churchService.date.getMonth() + 1} (day/month)`);
          console.log("----------------------------------------------------");
            
          //debugger;
          await this.addServiceWebUpload.createService(churchService);          
          await this.addVolunteersWebUpload.addVolunteers(churchService);

        }

        var endTime = new Date();

        var time = Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60);

        console.log(`duration: ${time} minutes`);
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