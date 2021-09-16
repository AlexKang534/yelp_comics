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
		}
	}
	
	try {
		const comic = await Comic.create(newComic);
		console.log(comic)
		res.redirect("/comics/" +  comic._id);
	} catch (err) {
			console.log(err)
		res.redirect('You Broke it .... /comics POST')
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
		res.redirect(`/comics/${req.params.id}`)

	} catch (err) {
		res.send('Broken again ... /comics/id PUT');
	}
	
})
	


//DELETE
router.delete("/:id", checkComicOwner, async (req, res) => {
	try {
		const deletedComic = await Comic.findByIdAndDelete(req.params.id).exec();
		console.log('deleted:', deletedComic)
		res.redirect("/comics")
	} catch (err) {
		console.log(err);
		res.send("Broken again... /comics/id delete");
	}
	
})



module.exports = router;