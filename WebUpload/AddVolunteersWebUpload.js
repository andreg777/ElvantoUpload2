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
        console.log('update roster')
        for(let roster of churchService.roster)
        {
            await this.updateVolunteers(roster);
        }
    }

    this.updateVolunteers = async function(roster)
    {
        for(let volunteer of roster.volunteers)
        {
            console.log("update volunteers");
            await this.updateVolunteer(roster, volunteer);
        }
    }

    this.updateVolunteer = async function(roster, volunteer)
    {
        var position = roster.name;
        console.log("update volunteer")
        await this.clickPositionAddButton(position);
        console.log("done clickPositionAddButton");
        await this.selectPositionVolunteer(volunteer, position);
        console.log("done selectPositionVolunteer");
    }
    
    this.createNameSearchText = function (volunteer)
    {
        let searchText = null;

        if(!volunteer || !volunteer.lastname)
        {
            return searchText;
        }

        searchText = volunteer.lastname + ", ";

        if(volunteer.firstname)
        {
            searchText += volunteer.firstname;
        }
        else if(volunteer.initial)
        {
            searchText += volunteer.initial;
        }
        else
        {
            
        }

        return searchText.toLowerCase();
    }

    this.selectPositionVolunteer = async function(volunteer, position)
    {
        const searchText = this.createNameSearchText(volunteer);

        //console.log("selectPositionVolunteer:searchText=" + searchText);

        const options = { 
            volunteer: volunteer, 
            searchText: searchText, 
            appConstants: appConstants, 
            position: position 
        };

        await page.waitFor(appConstants.loadingDelay);
  
        await this.page.evaluate((options) => 
        {
            //var xpathSearch =  "//a[contains(., " + options.searchText + ")]";
            
            var xpathSearch =  "//a[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '" + options.searchText + "')]";

            //console.log("searching in activity: " + options.position);
            //console.log("searching volunteer with:")
            //console.log(xpathSearch);

            //var parentNode = document.querySelector(".available-volunteers");

            var volunteers = document.evaluate(xpathSearch, document, null, XPathResult.ANY_TYPE, null );
            
            var volunteer = volunteers.iterateNext();

            
            if (volunteer)
            {
                //console.log(`found volunteer ${volunteer}`);

                volunteer.click();

                setTimeout(function()
                {
                    //console.log("clicking confirmed button");
                    var confirmedButton = document.querySelector('.btn.btn-confirmed');
                    confirmedButton.click();

                    //console.log("clicking save button");

                    var saveButton = document.querySelector('.btn.btn-submit');

                    if(saveButton)
                    {                        
                        saveButton.click();
                        console.log(`assigned volunteer ${options.searchText} to ${options.position}`);
                    }
                    else
                    {
                        console.log("confirmed button not found");
                    }

                },options.appConstants.loadingDelay);                
            }
            else
            {
                console.log(`ERROR: Did not assign volunteer ${options.searchText}. Check ${options.position} does have ${options.searchText} available to select. `);

                //TODO: log this volunteer not found in elvanto and print name
                var cancelButton = document.querySelector(".btn.btn-cancel");
                
                if(cancelButton)
                {
                    //console.log("close button click");
                    cancelButton.click();              
                    //console.log("close button clicked");      
                }
                else
                {
                    //console.log("cant find close button");
                }
            }
        },options);
        
        await page.waitFor(appConstants.loadingDelay + 100); 
    }

    this.clickPositionAddButton = async function(name)
    {
        //console.log("openPositionVolunteers: " + name);
        await page.waitFor(appConstants.loadingDelay);

        const options = { name: name };

        await this.page.evaluate((options) =>
        {
            var xpathSearch = "//div[contains(text(), '" + options.name + "') and contains(@class,'position-header')]";
            
            console.log("searching for position with ")
            console.log(xpathSearch);
            console.log('start positions search');

            var positions = document.evaluate(xpathSearch, document, null, XPathResult.ANY_TYPE, null );

            var position = positions.iterateNext();

            //console.log("start iterateNext");

            if (position)
            {
                console.log(`found ${position}`);

                var searchButton = position.querySelector('button')
                
                if(searchButton)
                {
                    console.log("found search button ");

                    searchButton.click();

                    //while(document.querySelector('.el-modal-wrapper') == null)
                    //{
                    //    console.log("clicking search button")
                    //}
                    
                    //console.log("search button clicked")
                }
                else
                {
                    //console.log("Search button not found")
                }
            }
            else
            {
                console.log('ERROR activity not found: ' + options.name);
            }

            //console.log('done');

        },options);

        await page.waitFor(appConstants.loadingDelay);
    }
}

module.exports = AddVolunteersWebUpload;