const json = require('../revelation.json')

const markdown = json.map(chunk => {
	if (chunk.type === 'header') {
		return `# ${chunk.text}\n\n`
	} else if (chunk.type === 'paragraph break') {
		return '\n\n'
	} else if (chunk.type === 'verse') {
		return chunk.text
	} else {
		throw new Error(`forgot a case`)
	}
}).join('')

require('fs').writeFileSync('./revelation.md', markdown)
