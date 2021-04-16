const WebSocket = require("ws")
const wss = new WebSocket.Server({ port: 8082 })

// Function that generates an unique ID
getUniqueID = function () {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
  }                                  
  return s4() + s4() + '-' + s4()
}

wss.on("connection", ws => {
	// Sets an unique ID to the client and tells them that
	ws.id = getUniqueID()
	ws.send(JSON.stringify({
		type: "server-message",
		content:`Your id is ${ws.id}`
	}))
	console.log(`${ws.id} connected`)

	// Disconnection
	ws.on("close", () => {
		console.log(`${ws.id} disconnected`)
	})

	ws.on("message", unparsedData => {
		const data = JSON.parse(unparsedData)

		console.log(`${ws.id} sent`)
		console.log(data)

		wss.clients.forEach(client => {
			client.send(unparsedData);
		})
	})
})
