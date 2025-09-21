let filters = {}
let views = {}

filters.text = (block) => block.class == 'Text'
views.text = (block) => {
	let div = document.createElement("div")
	div.classList.add("text")
	div.classList.add("block")

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

	let inner = document.createElement("div")
	inner.innerHTML = block.content_html
	div.appendChild(inner)

	let editor = document.createElement("textarea")
	editor.value = block.content
	div.appendChild(editor)
	
	let btn = document.createElement("button")
	btn.innerText = 'edit'
	btn.onclick = () => toggleeditor()

	if (localStorage.getItem("ME") == block.user.slug)
	div.appendChild(btn)

	toggleeditor()

	return div
}

filters.image = (block) => block.class == 'Image'
views.image = (block) => {
	let div = document.createElement("div")
	div.classList.add("image")
	div.classList.add("block")

	let img = document.createElement("img")
	img.src = block.image.display.url

	div.appendChild(img)
	return div
}

filters.link = (block) => block.class == 'Link'
views.link = (block) => {
	let div = document.createElement("div")
	div.classList.add("link")
	div.classList.add("block")

	let a = document.createElement("a")
	a.href = block.source.url
	a.target = "_blank"

	let span = document.createElement("span")
	span.textContent = block.title

	a.appendChild(span)
	div.appendChild(a)
	return div
}

filters.channel = (block) => block.class == 'Channel'
views.channel = (block) => {
	let div = document.createElement("div")
	div.classList.add("channel")
	div.classList.add("block")

	let a = document.createElement("a")
	a.href = `../#!/${block.slug}`

	let h4 = document.createElement("h4")
	h4.textContent = block.title

	a.appendChild(h4)
	div.appendChild(a)
	return div
}

filters.media = (block) => block.class == 'Media'
views.media = (block) => {
	let div = document.createElement("div")
	div.classList.add("media")
	div.classList.add("block")

	let span = document.createElement("span")
	span.classList.add("tag")
	span.textContent = "media "

	let h4 = document.createElement("h4")
	h4.textContent = block.title

	div.appendChild(span)
	div.appendChild(h4)
	return div
}

filters.attachment = (block) => block.class == 'Attachment'
views.attachment = (block) => {
	let div = document.createElement("div")
	div.classList.add("attachment")
	div.classList.add("block")

	let span = document.createElement("span")
	span.classList.add("tag")
	span.textContent = "attachment "

	let h4 = document.createElement("h4")
	h4.textContent = block.title

	div.appendChild(span)
	div.appendChild(h4)
	return div
}
export let what_computers = {filters, views}
