const express = require('express');
const router = express.Router({mergeParams: true});
const Comment = require('../models/comment');
const Comic = require('../models/comic');
const isLoggedIn = require('../utils/isLoggedIn');
const checkCommentOwner = require('../utils/checkCommentOwner');

//new comment - show form
router.get('/new', isLoggedIn, (req, res) => [
	res.render('comments_new', {comicId: req.params.id})
])


//new comment - update DB
router.post('/', isLoggedIn, async (req, res) => {
	try {
	const comment = await Comment.create({
		user:{
			id: req.user._id,
			username: req.user.username
		},
		text:req.body.text,
		comicId: req.body.comicId
	});
		req.flash('success', 'Comment created');
		res.redirect(`/comics/${req.body.comicId}`)
	} catch(err) {
		console.log(err)
		req.flash('error', 'Error in creating comment');
		res.redirect("/comics")
	}

})

//edit comment 
router.get('/:commentId/edit', checkCommentOwner, async (req, res) => {
	try {
		const comic = await Comic.findById(req.params.id).exec();
		const comment = await Comment.findById(req.params.commentId).exec();
		res.render('comments_edit', {comic, comment})
	} catch (err) {
		console.log(err);
		res.redirect('/comics')
	}
})

//update comment in db
router.put('/:commentId', checkCommentOwner, async (req, res) => {
	try {
		const comment = await Comment.findByIdAndUpdate(req.params.commentId, {text: req.body.text}, {new: true});
		req.flash('success', 'You have edited the comment')
		res.redirect(`/comics/${req.params.id}`)
	}catch (err) {
		console.log(err);
		res.flash('error', 'Error editing comment')
		res.redirect('/comics');
	}
})

//delete comment
router.delete('/:commentId', checkCommentOwner, async (req, res) => {
	try {
		const comment = await Comment.findByIdAndDelete(req.params.commentId);
		req.flash('success', 'Comment deleted');
		res.redirect(`/comics/${req.params.id}`)
	} catch (err) {
		console.log(err);
		req.flash('error', 'Error deleting comment')
		res.redirect('/comics')
	}
})



module.exports = router;