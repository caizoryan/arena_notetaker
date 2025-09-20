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

export let unthought = {filters, views}
