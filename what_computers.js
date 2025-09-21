let filters = {}
let views = {}

function isNode (el) {
  return el && el.nodeName && el.nodeType
}
let dom = (el, ...contents) => {
	let ell = "div"
	let classes = []
	let id = ""
	let parseclass = (str) => {
		let identifiers = str.split(/([\.#]?[^\s#.]+)/).map(e => e.trim()).filter(e => e!= "")
		if(!(/^\.|#/.test(identifiers[0]))) {
			ell = identifiers[0]
			identifiers.shift()
		}

		identifiers.forEach(i => {
			if(i[0] == ".") classes.push(i.slice(1))
			if(i[0] == "#") id = i.slice(1)
		})

	}

	parseclass(el)
	let d = document.createElement(ell)

	classes.forEach((c) => d.classList.add(c))
	id ? d.id = id : null

	contents.forEach((e) => {
		if (typeof e == 'string') d.innerText += e
		else if (isNode(e)) d.appendChild(e)
		else if (typeof e == 'object'){
			Object.entries(e).map(([k, v]) => {
				d[k] = v
			})
		}
	})

	return d
}

filters.text = (block) => block.class == 'Text'
views.text = (block) => {
	let editorstate = true
	let toggleeditor = () => {
		editorstate = !editorstate
		if (editorstate) {
			inner.style.display = 'none'
			editor.style.display = 'block'
			btn.innerText = 'view'
		}
		else {
			editor.style.display = 'none'
			inner.style.display = 'block'
			btn.innerText = 'edit'
		}
	}
	let inner = dom("div", {innerHTML: block.content_html})
	let editor = dom("textarea", {value: block.content})

	let div = dom(".text.block", editor, inner)

	let btn = document.createElement("button", {onclick: toggleeditor}, "edit")
	if (localStorage.getItem("ME") == block.user.slug) div.appendChild(btn)

	toggleeditor()

	return div
}

filters.image = (block) => block.class == 'Image'
views.image = (block) => {
	let img = dom("img", {src: block.image.display.url})
	let div = dom("div.image.block", img)
	return div
}

filters.link = (block) => block.class == 'Link'
views.link = (block) => {
	let span = dom("span", block.title)
	let a = dom("a", {href : block.source.url, target : "_blank"}, span)
	let div = dom(".link.block", a)
	return div
}

filters.channel = (block) => block.class == 'Channel'
views.channel = (block) => {
	let a = dom("a", {href:  `../#!/${block.slug}`}, dom("h4", block.title))
	let div = dom(".channel.block", a)
	return div
}

filters.media = (block) => block.class == 'Media'
views.media = (block) => {
	let span = dom("span.tag", "media")
	let h4 = dom("h4", block.title)
	let div = dom(".media.block", span, h4)
	return div
}

filters.attachment = (block) => block.class == 'Attachment'
views.attachment = (block) => {
	let span = dom("span.tag",  "attachment ")
	let h4 = dom("h4", block.title)
	let div = dom(".attachment.block", span, h4)
	return div
}
export let what_computers = {filters, views}
