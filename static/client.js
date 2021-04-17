// =========================
// YT STUFF
// =========================

let player = null;
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		height: '600',
		width: '900',
		videoId: 'sPGm6zsyJ3o',
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
}

function onPlayerReady(event) { }
function onPlayerStateChange(event) {  console.log("Something changed! IDK what")  }

function playVideo() { player.playVideo(); }
function pauseVideo() { player.pauseVideo(); }
function playVideoId(id, startSeconds=0) { player.loadVideoById(id, startSeconds) }
function seekTo(seconds=0) { player.seekTo(seconds) }

// =========================
// WEBSOCKETS STUFF
// =========================

const ws = new WebSocket("wss://quirino.net:8082")

ws.addEventListener("open", () => {
	console.log("Connected to server")
})

ws.addEventListener("message", (unparsedData) => {
	const data = JSON.parse(unparsedData.data)
	console.log("Received the message")
	console.table(data)

	if (data.type == "videoid") playVideoId(data.videoid);
	if (data.type == "play")    playVideo();
	if (data.type == "pause")   pauseVideo();
	if (data.type == "sync")    seekTo(data.seconds);
})

ws.addEventListener("close", () => {
	console.log("Disconnected from server")
})

const sendMessage = (message) => {
	ws.send(JSON.stringify(message))

	console.log("Sent the message")
	console.table(message)
}

const sendId = () => {
	var myString = url_input.value
	let myRegexp = /v=([\w-]+)/g
	var match = myRegexp.exec(url_input.value);

	if (match != null) {
		sendMessage({
			type: "videoid",
			videoid: match[1]
		})
		url_input.value = ""
	}
}

const sendPlay  = () => sendMessage({type: "play"})
const sendPause = () => sendMessage({type: "pause"})
const sendSync  = () => sendMessage({type: "sync", seconds: player.getCurrentTime() })

url_input			 = document.getElementById("url-input")
url_button		 = document.getElementById("url-button")
play_button		 = document.getElementById("play-button")
pause_button   = document.getElementById("pause-button")
sync_button		 = document.getElementById("sync-button")

url_button.addEventListener("click", sendId)
play_button.addEventListener("click", sendPlay)
pause_button.addEventListener("click", sendPause)
sync_button.addEventListener("click", sendSync)
