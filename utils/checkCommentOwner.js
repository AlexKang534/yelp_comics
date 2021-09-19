const Comment = require('../models/comment');


const checkCommentOwner = async (req, res, next) => {
	if (req.isAuthenticated()) {	//Check if user is logged in 
			//if logged in, check if they own comment
		const comment = await Comment.findById(req.params.commentId).exec();
			//if owner, then allow render the form to edit
		if (comment.user.id.equals(req.user._id)) {
			next();
		} else {//if not, redirect back to show page
			req.flash('error', "You don't have permissions to do that" )
			res.redirect('back');
		}
	} else {//If not logged in, redirect to /login
		req.flash('error', "You must be logged in to do that")
		res.redirect('/login')	
	}
}

module.exports = checkCommentOwner;