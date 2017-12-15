const {postMessage, log} = JavaScriptController;

Object.defineProperties(this, {
	postMessage: {
		value: postMessage
	},
	console: {
		value: {
			log: log,
			error: log
		}
	}
});

postMessage({v: "One", z: "Hello World"})
console.log("Bye!")

//throw this

