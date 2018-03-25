
function Person (options)
{
    this.firstname = null;
    this.middlename = null;
    this.lastname = null;

    Object.assign(this, options);
    
    //this.firstnameNameInitials = null;
    //this.middleNameInitials = null;

}

module.exports = Person;
