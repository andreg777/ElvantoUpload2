
function ChurchService (options)
{
	this.roster = null;
	this.churchType = null;
	this.date = null;
		
	Object.assign(this, options);
}

module.exports = ChurchService;
