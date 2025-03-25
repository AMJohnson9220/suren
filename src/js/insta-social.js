// class Instagram {
// 	constructor() {
// 		this.init();
// 	}

// 	init(){
// 		const userId = 'vapegoldbar'
// 		const fields = 'media_url,permalink,caption,thumbnail_url'
// 		const accessToken = 'IGQWRONEw0ZAlhhcXJOTkxoVFh6QS11Rm5ORlNSOEszTzZATTkRVNlR2RUsxbTVneF84OXdDNUVueGJyRUJ2WTJvdlpoSnYyYjJKNmVYVlh4TnlhRW9BSjNmYThhNTQydXBlLTBjemRUYW40SFBQYXpJcWNPYTltcncZD'

// 		fetch(`https://graph.instagram.com/me/media?fields=${fields}&access_token=${accessToken}`)
// 		.then(res => res.json())
// 		.then(res => this.buildInstafeed(res))
// 	}

// 	buildInstafeed(instaData) {
//     let _ = this
// 		const data = instaData.data.slice(0, 3)

// 		if(document.querySelector('.social-images--block') != null) {
// 			data.forEach((item) => {
// 				document.querySelector('.social-images--block').innerHTML += _.buildDataPosts (
// 					item,
// 					data
// 				)
// 			})
// 		}
// 	}

// 	buildDataPosts(data) {
// 		let elm =
//     `
// 			<li class="social-images--image">
//       	<a href="${data.permalink}" target="_blank">
//           ${data.thumbnail_url ? `
//             <div class="thumbnail--container">
//               <img class="image--thumbnail" src="${data.thumbnail_url}" alt="">
//             </div>
//             ` : `
//             <img src="${data.media_url}" alt="">
//           `}
//         </a>
// 			</li>
//     `
// 		return elm
// 	}
// }
// new Instagram();