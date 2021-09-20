// ====================
// Select Elements
// ====================
const upvoteBtn = document.getElementById('upvote_btn');
const downvoteBtn = document.getElementById('downvote_btn');


// ==============
// Add Event Listeners 
// ==============
upvoteBtn.addEventListener('click', async function() {
	// Build fetch options
	const options = {
		method: "POST",
		headers:{
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({vote: 'up'})
	}
	
	//Send fetch requests
	await fetch('/comics/vote', options)
	.then(data => {
		return data.json()
	})
	.then(res => {
		console.log(res)
	})
	.catch (err => {
		console.log(err)
	})
})