
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
		
		churchTypes.forEach((churchType) =>
		{	  			
			var startAddress = this.findAddressByContent(churchType.name);			
			churchServices = this.readChurchTypeTable(startAddress, churchType);
		});

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
		
		if(foundNothing === false)
		{
			const person = new Person();
		
			var onlySurname = firstLastname.length === 1;
			if(onlySurname)
			{
				 person.lastname = firstLastname[0];
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
		return null;
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

		return content.split('&').join('|').split('\\/').join('|').split('|');
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
				var rosterDate = new Date(Date.parse(currentValue));

				if(isNaN(rosterDate) === false)
				{
					let year = new Date().getFullYear();
					let month = rosterDate.getMonth() + 1;
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
	 
		var desired_value = (desired_cell ? desired_cell.w : undefined);  

		return desired_value;
  }
}

module.exports = ExcelRosterExtract