import { slug } from "./script.js";

let filters = {}
let views = {}

let host = "https://api.are.na/v2/"

let localStorageSize = function () {
   let _lsTotal = 0,_xLen, _x;
   for (_x in localStorage) {
   if (!localStorage.hasOwnProperty(_x)) continue;
       _xLen = (localStorage[_x].length + _x.length) * 2;
       _lsTotal += _xLen;
   }
 return  (_lsTotal / 1024).toFixed(2);
}

if (localStorageSize() > 50) alert("Localstorage filling up... do something about this!")
console.log("size: ", localStorageSize(), "kb")
export const update_block = (block, body, slug, fuck = false) => {
	let history = localStorage.getItem("HISTORY")
	if (!history){history = {}} 
	else history = JSON.parse(history)

	if (!history[block.id]) history[block.id] = []
	history[block.id].push({
		date: new Date(),
		// TODO: should probably use last edit... not new edit...
		...body
	})

	localStorage.setItem("HISTORY", JSON.stringify(history))

  return fetch(host + `blocks/${block.id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("AUTH"),
    },
    method: "PUT",
    body: JSON.stringify(body),
  }).then((res) => {
    if (fuck) { fuck_refresh(slug) }
    return res
  });
};

export const fuck_refresh = (slug) => {
  fetch(host + "channels/" + slug + "/blocks", {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("AUTH"),
    },
    method: "POST",
    body: JSON.stringify({
      content: "temp",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      let block_id = data.id;
      disconnect_block(slug, block_id);
    });
};
export const disconnect_block = (slug, id) => {
  fetch(host + "channels/" + slug + "/blocks/" + id, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("AUTH"),
    },
    method: "DELETE",
  }).then((res) => {
    console.log(res)
  });
};

let isNode =(el) =>  el && el.nodeName && el.nodeType
let dom = (tag, ...contents) => {
	let el = "div"
	let classes = []
	let id = ""

	let parseclass = ((str) => {
		let identifiers = str.split(/([\.#]?[^\s#.]+)/).map(e => e.trim()).filter(e => e!= "")

		if(!(/^\.|#/.test(identifiers[0]))) {
			el = identifiers[0]
			identifiers.shift()
		}

		identifiers.forEach(i => {
			if(i[0] == ".") classes.push(i.slice(1))
			if(i[0] == "#") id = i.slice(1)
		})
	})(tag)

	let doc = document.createElement(el)

	classes.forEach((c) => doc.classList.add(c))
	id ? doc.id = id : null

	contents.forEach((e) => {
		if (typeof e == 'string') doc.innerText += e
		else if (isNode(e)) doc.appendChild(e)
		else if (typeof e == 'object') Object.entries(e).map(([k, v]) => doc[k] = v)
	})

	return doc
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
	let save = () => {
		update_block(block, {content: textarea.value, title: block.title, description: block.description}, slug, true)
			.then(res => {
				if (res.status == 204){
					// remove drafts
					// then get block and find it in channel.contents and replace and render
				}
			})
	}
	let inner = dom("div", {innerHTML: block.content_html})
	let textarea = dom("textarea", {value: block.content})
	let editor = dom(".editor", 
									 textarea,
									 dom("button", {onclick: save}, "save"))

	let div = dom(".text.block", editor, inner)

	let btn = dom("button", {onclick: toggleeditor}, "edit")
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
	let a = dom("a", {href:  `./#!/${block.slug}`}, dom("h4", block.title))
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
