const express = require('express');
const router = express.Router();
const Comic = require('../models/comic');
const Comment = require('../models/comment');
const isLoggedIn = require('../utils/isLoggedIn');
const checkComicOwner = require('../utils/checkComicOwner');

// INdex
router.get('/', async (req, res) => {
	console.log(req.user);
	try {
	const comics = await Comic.find().exec();
		res.render('comics', {comics})	
	} catch (err) {
		console.log(err);
		res.send('Broken... /index');
	}
	
})

//Create

router.post('/', isLoggedIn, async (req, res) => {
	const genre = req.body.genre.toLowerCase()
	const newComic = {
		title: req.body.title,
		description: req.body.description,
		author: req.body.author,
		publisher: req.body.publisher,
		date: req.body.date,
		series: req.body.series,
		issue: req.body.issue,
		genre,
		color: !!req.body.color,
		image: req.body.image,
		owner: {
			id: req.user._id,
			username: req.user.username
		},
		upvotes: [req.user.username],
		downvotes: []
	}
	
	try {
		const comic = await Comic.create(newComic);
		req.flash('success', 'Comic created');
		res.redirect("/comics/" +  comic._id);
	} catch (err) {
		req.flash('error', 'Error creating comic')
		res.redirect('/comics')
	}
})

//NEW
router.get('/new', isLoggedIn, (req, res) => {
	res.render('comics_new')
})

//Search (has to be above id route so that it won't think we are hitting a specific book)
router.get('/search', async (req, res) => {
	try {
		const comics = await Comic.find({
			$text: {
				$search: req.query.term
			}
		});
		res.render('comics', {comics});
	} catch(err) {
		console.log(err);
		res.send('broken search')
	}
})

//Genre
router.get('/genre/:genre', async (req, res) => {
	//Check if the given genre is valid
	const validGenres = ['manga', 'shonen', 'josei', 'slice-of-life', 'drama', 'horror', 'sports', 'comedy', 'historical']; 
	if (validGenres.includes(req.params.genre.toLowerCase())) {
			//If yes, continue
		const comics = await Comic.find({genre:req.params.genre}).exec();
		res.render('comics', {comics});
	} else { 
		//if no, send an error 
		res.send('Please Select a Valid Genre')
	}	
})

//Vote System
router.post('/vote', isLoggedIn, async (req, res) => {
	console.log("Request body:", req.body);
	
		//{
	//	comidId: 'abc123',
	//	voteType: 'up' or 'down'
	//}
	
	const comic = await Comic.findById(req.body.comicId)
	const alreadyUpvoted = comic.upvotes.indexOf(req.user.username) /// WIll be -1 if not found
	const alreadyDownvoted = comic.downvotes.indexOf(req.user.username) // Will be -1 if not found
	
	let response = {}
	//Voting logic
	if (alreadyUpvoted === -1 && alreadyDownvoted === -1) {
		if (req.body.voteType === "up") { //Upvoting
			comic.upvotes.push(req.user.username);
			comic.save()
			response = {message: "Upvoted!", code: 1}
		} else if (req.body.voteType === "down") {
			comic.downvotes.push(req.user.username);
			comic.save()
			response = {message: "Downvoted!", code: -1}
		} else { //Error
			response = {message: "Error 1", code: "err"}
		}
	} else if (alreadyUpvoted >= 0) { //already upvoted
		if (req.body.voteType === "up") {
			comic.upvotes.splice(alreadyUpvoted, 1);
			comic.save()
			response = {message: "Upvote Removed!", code: 0}
		} else if (req.body.voteType ==="down") {
			comic.upvotes.splice(alreadyUpvoted, 1);
			comic.downvotes.push(req.user.username);
			comic.save()
			response = {message: "Downvoted!", code: -1}
		} else { //error
			response = {message:"Error 2", code: "err"}	
		}
		
	} else if (alreadyDownvoted >= 0) { //already downvoted
		if (req.body.voteType === "up") {
			comic.downvotes.splice(alreadyDownvoted, 1);
			comic.upvotes.push(req.user.username);
			comic.save()
			response = {message: "Upvoted!", code: 1}
		} else if (req.body.voteType ==="down") {
			comic.downvotes.splice(alreadyDownvoted, 1); 
			comic.save()
			response = {message: "Downvote Removed!", code: 0}
		} else { //error
			response = {message: "Error 3!", code: "err"}
		}
	} else { //ERror
		response = {message: "Error 4!", code: "err"}
	}
	
	//UPdate SCore prior to sending
	response.score = comic.upvotes.length - comic.downvotes.length; 
	
	
	res.json(response);
});


//SHOW
router.get('/:id', async (req, res) => {
	try {
		const comic = await Comic.findById(req.params.id).exec();
		const comments = await Comment.find({comicId: req.params.id});
		res.render('comics_show', {comic, comments})
	} catch (err) {
		console.log(err);
		res.send('You Broke It .... /comics/:id')
	}
})	
	
///EDIT

router.get('/:id/edit', checkComicOwner, async (req, res) => {
		//if logged in, check if they own comic
		const comic = await Comic.findById(req.params.id).exec();
		res.render('comics_edit', {comic})
})


//UPDATE
router.put('/:id', checkComicOwner, async (req, res) => {
	const genre = req.body.genre.toLowerCase()
	const comicBody = {
		title: req.body.title,
		description: req.body.description,
		author: req.body.author,
		publisher: req.body.publisher,
		date: req.body.date,
		series: req.body.series,
		issue: req.body.issue,
		genre,
		color: !!req.body.color,
		image: req.body.image
	}
	try {
		const comic = await Comic.findByIdAndUpdate(req.params.id, comicBody, {new:true}).exec();
		req.flash('success', 'You have updated the comic');
		res.redirect(`/comics/${req.params.id}`)

	} catch (err) {
		console.log(err);
		req.flash('error', 'Error in updating the comic');
		res.redirect('/comics');
	}
	
})
	


//DELETE
router.delete("/:id", checkComicOwner, async (req, res) => {
	try {
		const deletedComic = await Comic.findByIdAndDelete(req.params.id).exec();
		req.flash('success', 'Comic has been deleted');
		res.redirect("/comics");
	} catch (err) {
		console.log(err);
		req.flash('error', 'Error in deleting comic');
		res.redirect('back');
	}
	
})



module.exports = router;