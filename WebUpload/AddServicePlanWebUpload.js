const Navigator = require("..\Navigation\Navigator");

function AddServicePlanWebUpload(page)
{
    this.page = page;

    this.navigator = new Navigator(page);

    this.addServicePlan(churchService)
    {
        this.navigator.gotoAddVolunteers();
        this.updateVolunteer(churchService);
    }

    this.updateVolunteers(churchService)
    {
        churchService.roster.forEach(roster => this.updateVolunteers(roster))
    }

    this.updateVolunteers(roster)
    {
        roster.volunteers.forEach((volunteer) => this.updateVolunteer(roster, volunteer));
    }

    this.updateVolunteer(roster, volunteer)
    {
        var name = roster.name;
        this.openPositionSearch(name);
        this.selectPositionVolunteer(volunteer);
    }
    
    this.selectPositionVolunteer(volunteer)
    {
        const options = { volunteer: volunteer };
        
        await this.page.evaluate((options) => 
        {            
            var xpathSearch =  `//a[contains(., '${ options.volunteer.lastname }')]`
            var volunteers = document.evaluate(xpathSearch, document, null, XPathResult.ANY_TYPE, null );
            var volunteer = volunteers.iterateNext();

            if(volunteer)
            {
                volunteer.click();
                document.querySelector('.btn.btn-sm.btn-confirmed.selected')
            }
            else
            {
                //TODO:log it or something
            }
        },options);
    }

    this.openPositionSearch(name)
    {
        const options = { name: name };
        
        await this.page.evaluate((options) => 
        {            
            var xpathSearch =  `//div[contains(., '${ options.name }')]`
            var positions = document.evaluate(xpathSearch, document, null, XPathResult.ANY_TYPE, null );
            var position = positions.iterateNext();

            console.log(position);
        },options);

    }
}