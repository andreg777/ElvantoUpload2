
const xlsx = require('xlsx');
const churchTypes = require('./domain/churchTypes');
const ChurchService = require('./domain/ChurchService');
const Person = require('./domain/Person');

const CONST = 
{
  A: 65,
  MAX_COLUMNS: 25,
  MAX_ROWS: 80
}

function ExcelRosterExtract ()
{ 
  this.workbook = null;
  this.sheet = null;
  
  
  this.extractData = async function()
  {
	var data = this.readData();
  } 

  this.process = async function()
  {
	await this.readData();  
  }
  
  this.readData = async function()
  {
    this.workbook = await xlsx.readFile('roster.xlsx');
	this.sheetName = this.workbook.SheetNames[0];
	this.sheet = this.workbook.Sheets[this.sheetName];
	
	return this.readTable();
  }
  
  this.readTable = function()
  {
		var churchServices = [];

		for(const churchType of churchTypes)
		{
			var startAddress = this.findAddressByContent(churchType.name);			
			if(startAddress)
			{
				var readServices = this.readChurchTypeTable(startAddress, churchType);
				churchServices = churchServices.concat(readServices);				
			}
		}

		return churchServices;
  }
  
  this.readChurchTypeTable = function(startAddress, churchType)
  {
		var properties = this.readProperties(startAddress);
		var dates = this.readDates(startAddress);

		var churchServices = [];

		dates.forEach(date => 
		{
				var churchService = new ChurchService();
				
				churchServices.push(churchService);

				churchService.date = date.date;
				churchService.roster = [];
				churchService.churchType = churchType;


				properties.forEach(property => 
				{
					let rosterItem = { name: property.name, volunteers: [] };
					rosterItem.volunteers = this.readVolunteers(date.column, property.row);
					
					churchService.roster.push(rosterItem);
				});
		});

		return churchServices;
	}

	this.readVolunteers = function (column, row)
	{
		var rawData = this.readCell(column, row);
		
		//debugger;
		//rawData = "Mim Hammonds";

		var volunteers = this.splitVolunteers(rawData);
		
		var sanitizedVolunteers = this.getSanitizedVolunteers(volunteers);
		
		return sanitizedVolunteers;
	}
	
	this.getSanitizedVolunteers = function(volunteers)
	{
		var sanitizedVolunteers = [];

		for(var index = 0; index < volunteers.length; index++)
		{
			const value = volunteers[index];

			const person = this.extractPersonDetails(value)

			if(person)
			{
				sanitizedVolunteers.push(person);
			}
		}

		return sanitizedVolunteers;
	}

	this.extractPersonDetails = function(value)
	{
		var testData = ['A.M. Geyer','A. Geyer','Ash Geyer','Geyer'];
			
	 	value = value;
		
		var firstLastname = "";

		if(value.indexOf(' ') >= 0)
		{
			firstLastname = value.split(' ');
		}
		else if(value.indexOf('.') >= 0)
		{
			firstLastname = value.split('.')
		}
		else if (value != null && value.length >= 1)
		{
			firstLastname = [];
			firstLastname.push(value);
		}

		var foundNothing = firstLastname.length === 0;
		
		if(foundNothing)
		{
			return null;
		}

		const person = new Person();
		
		var onlySurname = firstLastname.length === 1;

		if(onlySurname)
		{
			var lastname = firstLastname[0];
			var invalidSurname = lastname.length <= 2;
			
			if(invalidSurname)
			{
				return null;
			}

			person.lastname = lastname;

			return person;
		}
	
		const multipleNames = firstLastname.length == 2;

		if(multipleNames)
		{
			var names = firstLastname[0]
			var lastname = firstLastname[1];
			person.lastname = lastname;
				
			this.extractNamesAndInitials(person, names);
		}

		return person;
	}
	
	this.extractNamesAndInitials = function(person, names)
	{
		names = names.split('.');

		var firstnameOrInitial = '';
		
		if (names.length >= 0)
		{
			firstnameOrInitial = names[0];
		}
		
		if(firstnameOrInitial.length >= 2)
		{
			person.firstname = firstnameOrInitial;
		}
		else
		{
			person.initial = firstnameOrInitial;
		}		
	}

	this.splitVolunteers = function(content)
	{
		if(!content)
		{
			return [];
		}

		var namesArray = null;

		var isAnd = content.indexOf(" and ") >= 0;

		if(content.indexOf("&") >= 0)
		{
			namesArray =  content.split("&");
		}
		else if(content.indexOf("\/") >= 0)
		{
			namesArray =  content.split("\/");
		}
		else if(isAnd)
		{
			namesArray = content.split(" and ");
		}

		if(!namesArray)
		{
			return [content];
		}
		
		for(let i = 0; i < namesArray.length; i++)
		{
			var name = namesArray[i].replace(".").trim();

			var isInitial = name.length === 1;

			if(isInitial)
			{
				const notLast = i < namesArray.length - 1;

				if (notLast)
				{
					var nextName = namesArray[i + 1];

					var nextNameAndSurname = nextName.split(" ");

					if(nextNameAndSurname.length >= 2)
					{
						namesArray[i] = name + ' ' + nextNameAndSurname[1];
					}
				}
			}
		}

		return namesArray;

	}

	this.readDates = function (startAddress)
	{
		var column = startAddress.column;

		var row = startAddress.row;

		var dates = [];

		var currentValue = this.readCell(column, row);

		while(currentValue)
		{
			column++

			currentValue = this.readCell(column,row);
			
			if(currentValue)
			{				
				var rosterDate = this.convertExcelDateSerialToJsDate(currentValue); //new Date(Date.parse(currentValue));

				if(isNaN(rosterDate) === false)
				{
					dates.push({ date: rosterDate, column: column });
				}
			}
		}

		return dates;
	}
	
  
  this.readProperties = function(startAddress)
  {
	  var column = startAddress.column;
	  var row = startAddress.row;
	  
	  var properties = [];
	  
	  var currentValue = this.readCell(column, row);
	  
	  while(currentValue)
	  {		  
		  row++;
		  
		  currentValue = this.readCell(column, row);

		  if (currentValue)
		  {
			  currentValue = currentValue.trim();
			  properties.push({name: currentValue, row: row});
		  }
	  }
	  
	  return properties;
  }
  
  this.findAddressByContent = function(content)
  {
    for(var column = CONST.A; column <= CONST.A + CONST.MAX_COLUMNS; column++)
		{
      for(var row = 1; row <= CONST.MAX_ROWS; row++)
	  	{
				const readValue = this.readCell(column, row);
			
				if(content === readValue)
				{
					return {column: column, row: row};
				}
	  	}	
		}
	return null;
  }
  
  this.readCell = function(column, row)
  {
		column = String.fromCharCode(column);
		column = column.toString();
		row = row.toString();
		
		var desired_cell = this.sheet[column + row];
	 
		var desired_value = (desired_cell ? desired_cell.v : undefined);  

		return desired_value;
  }

  this.convertExcelDateSerialToJsDate = function(serial)
  {
	  console.log("converExcelDateSerial");
	  console.log(`serial ${serial}`);

      var utc_days  = Math.floor(serial - 25569);
	  var utc_value = utc_days * 86400;
	  var date_info = new Date(utc_value * 1000);
		
	  var fractional_day = serial - Math.floor(serial) + 0.0000001;
		
	  var total_seconds = Math.floor(86400 * fractional_day);
		
	  var seconds = total_seconds % 60;
		
	  total_seconds -= seconds;

	  var hours = Math.floor(total_seconds / (60 * 60));
	  var minutes = Math.floor(total_seconds / 60) % 60;
	  
	  var convertedDate = new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);

	  console.log(`convertedDate ${convertedDate}`);

	  return convertedDate;
  }
}

module.exports = ExcelRosterExtract