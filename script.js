import { components } from "./components.js"
import page from "./page.js";

let auth = localStorage.getItem("AUTH")
let me

fetch("https://api.are.na/v2/me", {
		headers: {authorization: `Bearer ${localStorage.getItem("AUTH")}`}
})
	.then((res) => res.json())
	.then(res => {
		me = res
		if (me.slug){
			console.log(me.slug)
			localStorage.setItem("ME", me.slug)
		}
	})

export let apply = (el, css) => {
	Object.entries(css).forEach(([key, value]) => el.style[key] = value)
}

let container = document.querySelector('.container')
let channel
let slug = "becoming-hypertext"

const initpage = () => {
	page("/", () => {
		init()
	});

	page("/:slug", (ctx) => {
		slug = (ctx.params.slug)
		init()
	});

	page({ hashbang: true });
	window.onhashchange = () => page(window.location.hash)
};

let imagetext = {
	filter : (block) => block.class == 'Text' ||block.class == 'Image',
	view : (block) => block.class == 'Text'
		? `<div class='block'>
				${block.content_html}
			</div>`
		: `<div class='block'>
				<img src='${block.image.display.url}'> </img>
			</div>`
}

let popup = (el) => {
	let div = document.createElement("div")
	div.appendChild(el)

	apply(div, {
		position: "fixed",
		width: "600px",
		height: "400px",
		top: "calc((100vh - 600px) / 2)",
		left: "calc((100vw - 400px) / 2)",
	})

  let btn = document.createElement("button")
	btn.innerText = "X"
	apply(btn, {
		position: "absolute",
		top: "10px",
		right: "10px",
	})

	btn.onclick = () => div.remove()
	div.appendChild(btn)

	document.body.appendChild(div)
}

let authpopup = () => {
	let auth = dom("div")
	let authinput = dom("input")
	auth.append(authinput)
	authinput.value = localStorage.getItem("AUTH")

	let save = dom("button", 'save')
	save.onclick = (e) => localStorage.setItem("AUTH", (authinput.value.trim()))
	auth.appendChild(save)

	apply(auth, {
		background: "white",
		padding: "1em",
		width: "100%",
		height:  "100%"
	})

	popup(auth)
}

let dom = (el, text) => {
	let d = document.createElement(el)
	if (text) d.innerText = text
	return d
}

let defaultview = [
	[".top-bar",
	 [{view: (channel) => {
			let btn = dom("button", 'auth')
			btn.onclick = authpopup
			return btn
		 }}],
	],
	[".text-blocks",
	 [['text']],
		 // ["text"],
		 // ["image"]
	 ],
	[".side-bar",
	 [
	  ["channel"],
		["image"],
		["link"],
		["media"],
		["attachment"],
	 ]
	],
]

async function init(){
	container.innerHTML = '<div>Loading...</div>'
	await fetch("https://api.are.na/v2/channels/"+slug+"?per=100", {
		headers: {authorization: `Bearer ${localStorage.getItem("AUTH")}`}
	})
		.then((res) => res.json())
		.then((res) => channel = res)

	render()
}

function render(){
	container.innerHTML = ''
	let root = components[channel.slug]
	if (!root) root = components["*"]
	let f = root.filters
	let v = root.views
	let view = root.root
	if (!view) view = defaultview

	let html = view.map((c) => processcomponent(c, f, v))
	html.forEach((e) => {
		container.appendChild(e)	
	})
	
}
let processcomponent = (comp, filters, views) => {
	if (!Array.isArray(comp)) console.error('item needs to be an array, is: ', comp)
	else if (Array.isArray(comp[0])) return comp.map(c => processcomponent(c, filters, views)).flat()

	else if (typeof comp[0] != 'string' && comp[0].view) {
		if (comp[0].filter){
			let html = channel
					.contents
					.filter(comp[0].filter)
					.map(comp[0].view)

			return html
		}

		else {
			let html = comp[0].view(channel)
			return html
		}
	}

	else if (views[comp[0]]) {
		//process view
		if (filters[comp[0]]) {
			let html = channel
					.contents
					.filter(filters[comp[0]])
					.map(views[comp[0]])
					
			return html
		}
		else {
			let html = views[comp[0]](channel)
			return html
		}
	}

	else if (comp[0].trim().slice(0,1) == "."){
		// check if [1] is object or array
		if (Array.isArray(comp[1])){
			// then div + processcomponent 
			let doc = document.createElement("div")
			let child =  processcomponent(comp[1], filters, views)
			console.log(child)

			if (Array.isArray(child)) child.forEach((e) => doc.appendChild(e))
			else doc.appendChild(child)

			doc.classList.add(comp[0].slice(1))
			console.log(doc.classList)
			return doc
		}
		else if (Array.isArray(comp[2])){
			// TODO: process [1] attributes...
			let doc = document.createElement("div")
			let child = processcomponent(comp[2], filters, views)
			if (Array.isArray(child)) child.map(doc.appendChild)
			else doc.appendChild(child)
			doc.classList.add(comp[0].slice(1))
			return doc
		}
	}
}

initpage()
