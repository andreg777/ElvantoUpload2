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
    }

    this.updateVolunteers = async function(roster)
    {
        for(let volunteer of roster.volunteers)
        {
            await this.updateVolunteer(roster, volunteer);
        }
    }

    this.updateVolunteer = async function(roster, volunteer)
    {
        var name = roster.name;
        await this.openPositionSearch(name);
        await this.selectPositionVolunteer(volunteer);
    }
    
    this.createNameSearchText = function (volunteer)
    {
        let searchText = null;

        if(!volunteer || !volunteer.lastname)
        {
            return searchText;
        }

        searchText = volunteer.lastname;

        if(volunteer.firstname)
        {
            searchText = searchText + ", " + volunteer.lastname;
        }
        else if(volunteer.initial)
        {
            searchText = searchText + ", " + volunteer.initial;
        }
        else
        {
            
        }

        return searchText;
    }

    this.selectPositionVolunteer = async function(volunteer)
    {        
        console.log("selectPositionVolunteer");

        const searchText = this.createNameSearchText(volunteer);
        
        const options = { volunteer: volunteer, searchText: searchText, appConstants: appConstants };

        await page.waitFor(appConstants.loadingDelay);
  
        await this.page.evaluate((options) => 
        {
            var xpathSearch =  `//a[contains(., '${ options.searchText }')]`
            
            console.log("searching volunteer with:")
            console.log(xpathSearch);

            var volunteers = document.evaluate(xpathSearch, document, null, XPathResult.ANY_TYPE, null );
            
            var volunteer = volunteers.iterateNext();
            
            if (volunteer)
            {
                volunteer.click();

                setTimeout(function()
                {
                    console.log("clicking confirmed button");
                    var confirmedButton = document.querySelector('.btn.btn-submit');
                    if(confirmedButton)
                    {
                        confirmedButton.click();
                    }
                    else
                    {
                        console.log("confirmed button not found");
                    }

                },options.appConstants.loadingDelay);                
            }
            else
            {
                //TODO: log this volunteer not found in elvanto and print name
                var cancelButton = document.querySelector(".btn.btn-cancel");
                console.log("cant find volunteer");
                if(cancelButton)
                {
                    console.log("cancelling");
                    cancelButton.click();                    
                }
                else
                {
                    console.log("cant find cancel button");
                }
            }
        },options);
    }

    this.openPositionSearch = async function(name)
    {        
        console.log("openPositionSearch: " + name);
        await page.waitFor(appConstants.loadingDelay);

        const options = { name: name };

        await this.page.evaluate((options) =>
        {
            var xpathSearch = '//div[contains(text(), "' + options.name + '")]';
            
            console.log("searching for position with ")
            console.log(xpathSearch);
            
            var positions = document.evaluate(xpathSearch, document, null, XPathResult.ANY_TYPE, null );

            var position = positions.iterateNext();

            if (position)
            {
                var searchButton = position.querySelector('a')

                if(searchButton)
                {
                    searchButton.click();
                    console.log("search button clicked")
                }
                else
                {
                    console.log("Search button not found")
                }
            }
            else
            {
                console.log('position not found ')
            }
            console.log(position);
            console.log('done');
        },options);
    }
}

module.exports = AddVolunteersWebUpload;