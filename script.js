import { components } from "./components.js"
import page from "./page.js";


let container = document.querySelector('.container')
let channel
let slug = "female-rage-oiacsy8egp0"

const initpage = () => {
	page("/", () => {
		slug = ("")
		container.innerHTML = defaultview
	});

	page("/:slug", (ctx) => {
		slug = (ctx.params.slug)
		init()
	});

	page({ hashbang: true });
	window.onhashchange = () => page(window.location.hash)
};


let defaultview = `
<div>try to add '/#!/any-arena-slug' to the url</div>
` 


let view = [
	[".text-blocks", ["text"]],
	[".side-bar",
	 [
	  ["channel"],
		["link"],
		["image"],
		["media"],
		["attachment"],
	 ]],
]

async function init(){
	await fetch("https://api.are.na/v2/channels/"+slug+"?per=100")
		.then((res) => res.json())
		.then((res) => {
			channel = res
		})

	let root = components[channel.slug]
	if (!root) root = components["*"]
	let f = root.filters
	let v = root.views

	let html = view.map((c) => processcomponent(c, f, v)).join(`\n`)

	container.innerHTML = html
}

let processcomponent = (comp, filters, views) => {
	if (!Array.isArray(comp)) console.error('item needs to be an array, is: ', comp)
	else if (Array.isArray(comp[0])) return comp.map(c => processcomponent(c, filters, views)).join(`\n`)
	else if (views[comp[0]]) {
		//process view
		if (filters[comp[0]]) {
			let html = channel
					.contents
					.filter(filters[comp[0]])
					.map(views[comp[0]])
					.join(`\n`)
					
			return html
		}
		else {
			console.error("Not implemented filterless views")
		}
	}

	else if (comp[0].trim().slice(0,1) == "."){
		// check if [1] is object or array
		if (Array.isArray(comp[1])){
			// then div + processcomponent 
			return `<div class=${comp[0].slice(1)}>${processcomponent(comp[1], filters, views)}</div>`
		}
		else if (Array.isArray(comp[2])){
			// TODO: process [1] attributes...
			return `<div class=${comp[0].slice(1)}>${processcomponent(comp[2], filters, views)}</div>`
		}
	}
}

initpage()
