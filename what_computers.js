let filters = {}
let views = {}

filters.text = (block) => block.class == 'Text'
views.text = (block) => `
<div class='block'>
 ${block.content_html}
</div>
`

filters.image = (block) => block.class == 'Image'
views.image = (block) => `
<div class='block'>
	<img src='${block.image.thumb.url}'> </img>
</div>
`

filters.link = (block) => block.class == 'Link'
views.link = (block) => `
<div class='link block'>
	<a href='${block.source.url}' target='_blank'><span>${block.title}</span></a>
</div>
`

filters.channel = (block) => block.class == 'Channel'
views.channel = (block) => `
<div class='channel block'><h4>${block.title}</h4></div>
`

filters.media = (block) => block.class == 'Media'
views.media = (block) => `
<div class='media block'>
	<span class='tag'>media </span>
	<h4>${block.title}</h4>
</div>
`

filters.attachment = (block) => block.class == 'Attachment'
views.attachment = (block) => `
<div class='attachment block'>
	<span class='tag'>attachment </span>
	<h4>${block.title}</h4>
</div>
`

export let what_computers = {filters, views}
