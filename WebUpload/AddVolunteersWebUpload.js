const Navigator = require("../Navigation/Navigator");

function AddVolunteersWebUpload(page)
{
    this.page = page;

    this.navigator = new Navigator(page);

    this.addServicePlan = async function(churchService)
    {
        await page.waitFor(5000);
        await this.navigator.gotoAddVolunteers();
        await this.updateRoster(churchService);
    }

    this.updateRoster = async function(churchService)
    {
        var roster = churchService.roster[0];
        await this.updateVolunteers(roster);
        /*
        churchService.roster.forEach(async roster => 
            {
                await this.updateVolunteers(roster);
            });
        */
    }

    this.updateVolunteers = async function(roster)
    {
        var volunteer = roster.volunteers[0];
        await this.updateVolunteer(roster, volunteer);

        /*
        roster.volunteers.forEach(async (volunteer) =>
        { 
            await this.updateVolunteer(roster, volunteer)
        });
        */
    }

    this.updateVolunteer = async function(roster, volunteer)
    {
        //debugger;
        var name = roster.name;
        await this.openPositionSearch(name);
        //await this.selectPositionVolunteer(volunteer);
    }
    
    this.selectPositionVolunteer = async function(volunteer)
    {
        const options = { volunteer: volunteer };
        
        await this.page.evaluate((options) => 
        {            
            console.log('1');
            var xpathSearch =  `//a[contains(., '${ options.volunteer.lastname }')]`
            console.log('2');
            var volunteers = document.evaluate(xpathSearch, document, null, XPathResult.ANY_TYPE, null );
            console.log('3');
            var volunteer = volunteers.iterateNext();
            console.log('4');
            
            if(volunteer)
            {
                //console.log("found volunteer " + JSON.stringify(volunteer));
                volunteer.click();
                document.querySelector('.btn.btn-sm.btn-confirmed.selected')
            }
            else
            {
                console.log('volunteer not found');
                //TODO:log it or something
            }
        },options);
    }

    this.openPositionSearch = async function(name)
    {
        debugger;
        
        await page.waitFor(4000);

        await this.page.evaluate(() =>
        {
            console.log('test');
        });

        //const options = { name: name };
        
        //await this.page.evaluate(() => 
        //{
            
            //console.log('searching position ' + options.name);            
            /*
            var xpathSearch =  `//div[contains(., '${ options.name }')]`            
            var positions = document.evaluate(xpathSearch, document, null, XPathResult.ANY_TYPE, null );

            console.log('found: ' + positions.length);

            var position = positions.iterateNext();

            console.log(position);
            */
        //});

        debugger;
    }
}

module.exports = AddVolunteersWebUpload;