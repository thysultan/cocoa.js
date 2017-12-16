const {postMessage, log} = JavaScriptController

const ELEMENT_NODE = 1
const TEXT_NODE = 3
const PROCESSING_INSTRUCTION_NODE = 7
const COMMENT_NODE = 8
const DOCUMENT_NODE = 9
const DOCUMENT_TYPE_NODE = 10
const DOCUMENT_FRAGMENT_NODE = 11

const SymbolForEventTarget = Symbol('EventTarget')
const SymbolForTextContent = Symbol('TextContent')
const SymbolForNode = Symbol('Node')
const SymbolForCSSText = Symbol('CSSText')
const SymbolForBreak = Symbol('Break')
const SymbolForContinue = Symbol('Continue')
const SymbolForLength = Symbol('Length')
const SymbolForUUID = Symbol('UUID')

class NamedNodeMap {}

class CSSStyleDeclaration {
	constructor() {
		this[SymbolForCSSText] = ''
	}
	setProperty(name, value) {}
	removeProperty(name, value) {}
	getPropertyValue(name) {}
	get cssText() {
		return this[SymbolForCSSText]
	}
	set cssText(value) {
		this[SymbolForCSSText] = value != null ? String(value) : ''
		return value
	}
}

class NodeList {
	constructor(node, call) {
		this[SymbolForNode] = node

		this.forEach((node, index) => {
			Object.defineProperty(this, index, {
				get: () => this.forEach((node, i) => index === i ? SymbolForBreak : SymbolForContinue)
			})
		})
	}
	get length() {
		return this[SymbolForNode][SymbolForLength]
	}
	forEach(callback, thisArg) {
		const index = 0
		const node = this[SymbolForNode]
		const firstChild = node.firstChild
		const nextSibling = firstChild

		while (nextSibling) {
			if (callback.call(thisArg, nextSibling, index++) === SymbolForBreak) {
				break
			}
			nextSibling = nextSibling.nextSibling
		}
	}
}

class Event {
	constructor(type) {
		this.type = type
		this.target = null
	}
}

class EventTarget {
	constructor() {
		this[SymbolForEventTarget] = {}
	}
	addEventListener(type, handler, options) {
		const types = this[SymbolForEventTarget]
		const listeners = types[type] || (types[type] = new Map())

		if (handler) {
			if (typeof handler === 'function' || typeof handler === 'object') {
				listeners.set(handler, options)
			}
		}
	}
	removeEventListener(type, handler, options) {
		const listeners = this[SymbolForEventTarget][type]

		if (listeners && handler.has(handler)) {
			listeners.delete(handler)
		}
	}
	dispatchEvent(event) {
		const types = this[SymbolForEventTarget]
		const listeners = types[event.type]

		if (listeners && listeners.size > 0) {
			listeners.forEach((handler) => {
				if (typeof handler === 'function') {
					listeners(event)
				} else if (typeof handler.handleEvent === 'function') {
					handler.handleEvent(event)
				}
			})
		}
	}
}

class Node extends EventTarget {
	constructor() {
		super()
		this.nodeType = 0
		this.parentNode = null
		this.prevSibling = null
		this.nextSibling = null
		this.firstChild = null
		this.lastChild = null

		this[SymbolForLength] = 0
		this[SymbolForUUID] = 0
		this[SymbolForTextContent] = ''
	}
	get textContent () {
		return this[SymbolForTextContent]
	}
	set textContent (value) {
		const stringValue = this[SymbolForTextContent] = value != null ? String(value) : ''

		if (this.nodeType === TEXT_NODE) {
			this.nodeValue = stringValue
		} else {
			this.childNodes.forEach((node) => this.removeChild(node))
		}

		return value
	}
	get childNodes () {
		return new NodeList(this)
	}
	replaceChild(newChild, oldChild) {
		this.insertBefore(newChild, oldChild)
		this.removeChild(oldChild)

		return newChild
	}
	removeChild(oldChild) {
		const prevSibling = oldChild.prevSibling
		const nextSibling = oldChild.nextSibling

		if (oldChild.parentNode !== this) {
			return
		}

		if (prevSibling) {
			prevSibling.prevSibling = prevSibling
		} else {
			this.lastChild = prevSibling
		}

		if (nextSibling) {
			prevSibling.nextSibling = nextSibling
		} else {
			this.firstChild = nextSibling
		}

		oldChild.parentNode = null
		oldChild.prevSibling = null
		oldChild.nextSibling = null

		--this[SymbolForLength]

		return oldChild
	}
	appendChild(newChild) {
		const lastChild = this.lastChild
		const parentNode = newChild.parentNode

		if (parentNode) {
			parentNode.removeChild(newChild)
		}

		if (lastChild) {
			lastChild.nextSibling = newChild
		}

		this.lastChild = newChild.prevSibling = newChild
		newChild.parentNode = this

		++this[SymbolForLength]

		return newChild
	}
	insertBefore(newChild, referenceNode) {
		const prevSibling = referenceNode.prevSibling
		const parentNode = newChild.parentNode

		if (parentNode) {
			parentNode.removeChild(newChild)
		}

		if (prevSibling) {
			prevSibling.nextSibling = newChild
		} else {
			this.firstChild = newChild
		}

		newChild.parentNode = this
		newChild.nextSibling = referenceNode
		referenceNode.prevSibling = newChild

		++this[SymbolForLength]

		return newChild
	}
}
class Document extends Node {
	constructor() {
		super()
		this.nodeType = DOCUMENT_NODE
	}
}

class Element extends Node {
	constructor() {
		super()
		this.nodeType = ELEMENT_NODE
	}
	get children () {
		return new NodeList(this, (node) => node.nodeType !== TEXT_NODE)
	}
}

class CharacterData extends Node {
	get data () {
		return this.nodeValue
	}
	get length () {
		return this.nodeValue.length
	}
}

class Text extends CharacterData {
	constructor(value) {
		super()
		this.nodeType = TEXT_NODE
		this.nodeName = '#text'
		this.nodeValue = String(value !== undefined ? value : '')
	}
	splitText(offset) {
		const nodeValue = this.nodeValue
		const newNode = new Text(nodeValue.substring(offset))

		this.nodeValue = nodeValue.substring(0, offset)

		return this.parentNode.insertBefore(newNode, this)
	}
}

Object.defineProperties(this, {
	Document: {value: Document},
	Element: {value: Element},
	Node: {value: Node},
	NamedNodeMap: {value: NamedNodeMap},
	NodeList: {value: NodeList},
	EventTarget: {value: EventTarget},
	CharacterData: {value: CharacterData},

	postMessage: {value: postMessage},
	console: {value: {log: log, error: log}},
	document: {value: new Document},
	setTimeout: {value: null},
	clearTimeout: {value: null},
	setInterval: {value: null},
	clearInterval: {value: null}
})

postMessage({action: 1, message: "Hello World", document: this.document})
console.log("console.log works!")

