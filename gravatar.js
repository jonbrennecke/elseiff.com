var crypto = require('crypto');

module.exports = {

	// generate a gravatar for a user
	generate : function ( user ) {
		var gravatar = "http://www.gravatar.com/avatar/";
			gravatar += crypto.createHash('md5').update( user.email.toLowerCase().trim() ).digest("hex");
			gravatar += "?s=256";

			return {
				name : user.name,
				email : user.email,
				gravatar : gravatar
			}
	},

	// generate an anonymous gravatar
	anon : function () {
		return {
			gravatar : "http://www.gravatar.com/avatar/?d=identicon"
		}
	}

}

