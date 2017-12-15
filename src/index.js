const {postMessage, log} = JavaScriptController;

class CSSStyleDeclaration extends Object {}
class NamedNodeMap extends Object {}
class NodeList extends Object {}
class EventTarget extends Object {}
class Node extends EventTarget {}
class CharacterData extends Node {}

class Document extends Node {}
class Element extends Node {}
class Text extends CharacterData {}

Object.defineProperties(this, {
	postMessage: {value: postMessage},
	console: {value: {log: log, error: log}},
	Document: {value: Document},
	Element: {value: Element},
	Node: {value: Node},
	NamedNodeMap: {value: NamedNodeMap},
	NodeList: {value: NodeList},
	EventTarget: {value: EventTarget},
	document: {value: new Document},
	setTimeout: {value: null},
	clearTimeout: {value: null},
	setInterval: {value: null},
	clearInterval: {value: null}
});

postMessage({action: 1, message: "Hello World"});
console.log("console.log works!");

