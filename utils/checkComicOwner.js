const Comic = require('../models/comic');


const checkComicOwner = async (req, res, next) => {
	if (req.isAuthenticated()) {	//Check if user is logged in 
			//if logged in, check if they own comic
		const comic = await Comic.findById(req.params.id).exec();
			//if owner, then allow render the form to edit
		if (comic.owner.id.equals(req.user._id)) {
			next();
		} else {//if not, redirect back to show page
			res.redirect('back');
		}
	} else {//If not logged in, redirect to /login
		res.redirect('/login')	
	}
}

module.exports = checkComicOwner;