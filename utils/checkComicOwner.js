const Comic = require('../models/comic');


const checkComicOwner = async (req, res, next) => {
	if (req.isAuthenticated()) {	//Check if user is logged in 
			//if logged in, check if they own comic
		const comic = await Comic.findById(req.params.id).exec();
			//if owner, then allow render the form to edit
		if (comic.owner.id.equals(req.user._id)) {
			next();
		} else {//if not, redirect back to show page
			req.flash('error', "You don't have permission for this");
			res.redirect('back');
		}
	} else {//If not logged in, redirect to /login
		req.flash('error', 'You must be logged in to do this');
		res.redirect('/login')	
	}
}

module.exports = checkComicOwner;