const Navigator = require("../Navigation/Navigator");
const appConstants = require("../appConstants")

function AddServiceWebUpload (page)
{
    this.page = page;
    
    this.navigator = new Navigator(page);

    this.uploadService = async function (churchService) 
    {        
        await this.navigator.gotoAddService();
        await this.selectLocation(churchService.churchType);
        await this.setServiceStatus();
        await this.selectDate(churchService);
        await this.selectType(churchService.churchType);
        await this.saveService();
    }
    
    this.setServiceStatus = async function()
    {
        if(appConstants.published === false)
        {
            await this.page.click('[name=service_status]');
        }
    }

    this.selectLocation = async function(churchType)
    {    
        await this.page.select('[name=service_location]', churchType.id);
    }

    this.selectType = async function(churchType)
    {        
        await this.page.evaluate(() =>
        {
            document.querySelector('.service-type-select .btn.dropdown-toggle.btn-form.bs-placeholder').click();
        });

        const options = { name: churchType.name };
        
        await this.page.evaluate((options) => 
        {            
            var xpathSearch2 =  `//a[contains(., '${options.name}')]`
            var churches = document.evaluate(xpathSearch2, document, null, XPathResult.ANY_TYPE, null );
            var church = churches.iterateNext();
            church.click();
        },options);
    }

    this.selectDate = async function(churchService)
    {
        
        const year = new Date().getFullYear().toString().padStart(2,'0');
        const month = new Date().getMonth().toString().padStart(2,'0');
        const day = new Date().getDay().toString().padStart(2,'0');

        var dateValue = day + '/' + month + '/' + year;

        //TEST
        dateValue = "01/01/2015";

        await this.page.evaluate((dateValue) => 
        {
            console.log('23123123');
            var dateInput = document.querySelector('[name=serviceDateValue\\[1\\]]');
            dateInput.value = dateValue;
        }, dateValue);

    }
    this.saveService = async function ()
    {
        this.page.click('.form-btn.form-btn-bottom button.btn.btn-action')
    }
}

module.exports = AddServiceWebUpload;