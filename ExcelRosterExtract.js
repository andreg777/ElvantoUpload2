
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
		
		var firstLastname = value.split(' ');

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

		var splitContent = null;

		if(content.indexOf("&") >= 0)
		{
			splitContent =  content.split("&");
		}
		else if(content.indexOf("\\/") >= 0)
		{
			splitContent =  content.split("\\/");
		}
		else if(content.indexOf(" and "))
		{
			splitContent = content.split(" and ");
		}

		if(!splitContent)
		{
			return [content];
		}
		var hasSurname = content.lastIndexOf(' ') >= 0;
		
		var possibleSurname;
		
		if(hasSurname)
		{
			possibleSurname = content.substring(content.lastIndexOf(' '), content.length);
			possibleSurname = possibleSurname.trim();
		}

		var result = [];

		for(var value of splitContent)
		{
			value = value.replace('.','');
			value = value.trim();

			if(value.length <= 1)
			{
				value = value + ' ' + possibleSurname;
			}
			
			result.push(value);
		}

		return result;
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
					let year = new Date().getFullYear();
					let month = rosterDate.getMonth();
					let day = rosterDate.getDate();

					var currentDate = new Date(year, month, day);
					
					dates.push({ date: currentDate, column: column });
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
    var utc_days  = Math.floor(serial - 25569);
	var utc_value = utc_days * 86400;                                        
	var date_info = new Date(utc_value * 1000);
	 
	var fractional_day = serial - Math.floor(serial) + 0.0000001;
	 
	var total_seconds = Math.floor(86400 * fractional_day);
	 
	var seconds = total_seconds % 60;
	 
	total_seconds -= seconds;
	 
	var hours = Math.floor(total_seconds / (60 * 60));
	var minutes = Math.floor(total_seconds / 60) % 60;
	 
	return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
  }
}

module.exports = ExcelRosterExtract