
const isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash('error', 'You must be logged in');
		res.redirect('/login');
	}
}

module.exports = isLoggedIn;