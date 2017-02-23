const walk = require('walkdir')
const fs = require('fs')
const cheerio = require('cheerio')
const each = require('async-each')

const startAt = './html/'
// const fileStream = Bacon.fromNodeCallback(fs.readFile, './html/page2.html', { encoding: 'utf8' })

const boldNormalSelectorRegex = /\#(f\d) \{ font-family:sans-serif; font-weight:bold; font-style:normal/
const bracketsInTextRegex = /^\[(.+)\]$/
const pathNumberParser = /^.+\/page(\d+)\.html$/
const integerOnlyRegex = /^\d+\s*$/
const textParenthesesRegex = /parenthesis/i

const walkEmitter = walk(startAt)
const paths = []
walkEmitter.on('file', path => paths.push(path))
walkEmitter.on('end', () => {
	const orderedPaths = paths
	// .filter(path => /.*page3.html/.test(path))
	.filter(path => pathNumberParser.test(path)).map(path => {
		return {
			path: path,
			number: parseInt(pathNumberParser.exec(path)[1])
		}
	}).sort((a, b) => a.number - b.number)
	.map(o => o.path)

	each(orderedPaths, fs.readFile, (err, allFileContents) => {
		const output = allFileContents.map(convertHtmlToParsedVerses).reduce((ary, parsed) => ary.concat(parsed), [])
		fs.writeFileSync('./very-basic-parsed.json', JSON.stringify(output, null, '\t'))
	})
})

function convertHtmlToParsedVerses(html) {
	const $ = cheerio.load(html)
	const boldNormalId = boldNormalSelectorRegex.exec(html)[1]

	const elements = []

	$('body').children('div').each((i, div) => {
		div = $(div)
		const left = parseInt(div.css('left'))
		const prettyOffset = left > 133
		const singleIndent = left === 133
		let foundAParagraphAlready = false

		div.children('span').each((i, span) => {
			span = $(span)
			const boldNormal = boldNormalId === span.attr('id')
			let text = span.text()
			const size = parseInt(span.css('font-size'))
			const verticalAlign = span.css('vertical-align')
			const bracketsInText = bracketsInTextRegex.exec(text)

			let type = 'UNKNOWN'

			if (((boldNormal && size === 7) || size === 8) && integerOnlyRegex.test(text)) {
				type = 'chapter number'
			} else if (prettyOffset && bracketsInText) {
				if (!textParenthesesRegex.test(text)) {
					type = 'header'
					text = bracketsInText[1]
				}
			} else {
				if (singleIndent && !foundAParagraphAlready) {
					foundAParagraphAlready = true
					elements.push({
						type: 'paragraph break'
					})
				}

				const weirdParentheses = boldNormal && (text === '(' || text === ')')

				if (size === 3 && verticalAlign === 'super') {
					type = 'note number'
				} else if (size === 4 && verticalAlign === 'super') {
					type = 'note reference'
				} else if (size === 6 && verticalAlign === 'baseline' && !weirdParentheses) {
					type = 'verse'
				} else if (size === 5 && verticalAlign === 'baseline') {
					type = 'note'
				}
			}

			elements.push({
				type: type,
				text: text
			})
		})
	})

	return elements
}
