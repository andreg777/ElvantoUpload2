
function ChurchService (options)
{
	this.name = null;
	this.type = null;
	this.roster = null;
	
	Object.assign(this, options);
}

module.exports = ChurchService;
