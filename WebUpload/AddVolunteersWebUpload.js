const Navigator = require("../Navigation/Navigator");
const appConstants = require("../appConstants");

function AddVolunteersWebUpload(page)
{
    this.page = page;

    this.navigator = new Navigator(page);

    this.addVolunteers = async function(churchService)
    {
        await page.waitFor(appConstants.loadingDelay);
        await this.navigator.gotoAddVolunteers();
        await this.updateRoster(churchService);
    }

    this.updateRoster = async function(churchService)
    {
        for(let roster of churchService.roster)
        {
            await this.updateVolunteers(roster);
        }
        //churchService.roster.forEach(async (roster) => { await this.updateVolunteers(roster); } );        
    }

    this.updateVolunteers = async function(roster)
    {
        for(let volunteer of roster.volunteers)
        {
            await this.updateVolunteer(roster, volunteer);
        }

        //roster.volunteers.forEach(async (volunteer) => {this.updateVolunteer(roster, volunteer)});        
    }

    this.updateVolunteer = async function(roster, volunteer)
    {
        var name = roster.name;
        await this.openPositionSearch(name);
        await this.selectPositionVolunteer(volunteer);
    }
    
    this.selectPositionVolunteer = async function(volunteer)
    {
        
        const options = { volunteer: volunteer };

        await page.waitFor(appConstants.loadingDelay);
  
        await this.page.evaluate((options) => 
        {
            var xpathSearch =  `//a[contains(., '${ options.volunteer.lastname }')]`
            
            var volunteers = document.evaluate(xpathSearch, document, null, XPathResult.ANY_TYPE, null );
            
            var volunteer = volunteers.iterateNext();
            
            if (volunteer)
            {
                volunteer.click();

                setTimeout(function()
                {
                    var confirmedButton = document.querySelector('.btn.btn-submit');
                    confirmedButton.click();
                },3000);                
            }
            else
            {
                console.log('volunteer not found');
            }
        },options);
    }

    this.openPositionSearch = async function(name)
    {        
        await page.waitFor(appConstants.loadingDelay);

        const options = { name: name };

        await this.page.evaluate((options) =>
        {
            var xpathSearch = '//div[contains(text(), "' + options.name + '")]';
            
            console.log(xpathSearch);
            
            var positions = document.evaluate(xpathSearch, document, null, XPathResult.ANY_TYPE, null );

            var position = positions.iterateNext();

            if (position)
            {
                var searchButton = position.querySelector('a')
                if(searchButton)
                {
                    searchButton.click();
                }
            }
            else
            {

            }
            console.log(position);
            console.log('done');
        },options);
    }
}

module.exports = AddVolunteersWebUpload;