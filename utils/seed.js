const Comic = require('../models/comic');
const Comment = require('../models/comment');

const comic_seeds = [
	{
		title: "Bleach",
		description:"Ichigo Kurosaki never asked for the ability to see ghosts -- he was born with the gift. When his family is attacked by a Hollow -- a malevolent lost soul -- Ichigo becomes a Soul Reaper, dedicating his life to protecting the innocent and helping the tortured spirits themselves find peace.",
		author:"Tite Kubo",
		publisher:"Shueisha",
		date:"2001-08-7",
		series:"Bleach",
		issue: 1, 
		genre: "Shonen",
		color: true,
		image:"https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Bleach_cover_01.jpg/220px-Bleach_cover_01.jpg"
	},
	{
		title: "My Youth Romantic Comedy Is Wrong, As I Expected",
		description:"The story follows two loners, the pragmatic Hachiman Hikigaya and beautiful Yukino Yukinoshita, who despite their varying personalities and ideals, offer help and advice to others as part of their school's Service Club, assisted by the cheerful and friendly Yui Yuigahama. It largely depicts various social situations faced by teens in a high school setting and the psychology driving their interactions.",
		author:"Wataru Watari",
		publisher:"Shogakukan",
		date:"2011-03-18",
		series:"OreGairu ",
		issue: 1, 
		genre: "Slice of Life",
		color: true,
		image:"https://upload.wikimedia.org/wikipedia/en/thumb/c/ca/My_Teen_Romantic_Comedy_SNAFU_cover.jpg/220px-My_Teen_Romantic_Comedy_SNAFU_cover.jpg"
	},
	{
		title: "Tokyo Revengers",
		description:"Tokyo Revengers is a Japanese manga series written and illustrated by Ken Wakui. It has been serialized in Kodansha's Weekly Shōnen Magazine since March 2017. An anime television series adaptation by Liden Films premiered in April 2021. A live-action film adaptation was released in Japan in July 2021.",
		author:"Ken Wakui",
		publisher:"Kodansha",
		date:"2017-03-1",
		series:"Tokyo Revengers",
		issue: 1, 
		genre: "Shonen",
		color: true,
		image:"https://upload.wikimedia.org/wikipedia/en/thumb/b/b1/Tokyo_Revengers_volume_1_cover.jpg/220px-Tokyo_Revengers_volume_1_cover.jpg"
	}
]


const seed = async () => {
	// Delete all current comics and comments
	await Comic.deleteMany();
	console.log("deleted all the comics")
	await Comment.deleteMany();
	console.log("deleted all the comments")
	
	////Create three new comics
	//for (const comic_seed of comic_seeds) {
	//	let comic = await Comic.create(comic_seed);
	//	console.log('created a new comic:', comic.title)
	//	//create a new comment for each comic
	//	await Comment.create({
	//		text:"Great Comic",
	//		user:"Test",
	//		comicId: comic._id
	//	})
	//	console.log('created a new comment')
	//}

}



module.exports = seed; 