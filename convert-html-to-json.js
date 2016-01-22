var walk = require('walkdir')
var Bacon = require('baconjs').Bacon
var concat = require('concat-stream')
var fs = require('fs')
var cheerio = require('cheerio')

var startAt = './html/'
// var fileStream = Bacon.fromNodeCallback(fs.readFile, './html/page2.html', { encoding: 'utf8' })

var boldNormalSelectorRegex = /\#(f\d) \{ font-family:sans-serif; font-weight:bold; font-style:normal/
var bracketsInTextRegex = /^\[(.+)\]$/
var pathNumberParser = /^.+\/page(\d+)\.html$/

var orderedPathsStream = new Bacon.Bus()
var walkEmitter = walk(startAt)
var paths = []
walkEmitter.on('file', path => paths.push(path))
walkEmitter.on('end', () => {
	paths.filter(path => pathNumberParser.test(path)).map(path => {
		return {
			path: path,
			number: parseInt(pathNumberParser.exec(path)[1])
		}
	}).sort((a, b) => a.number - b.number).map(o => o.path).forEach(path => orderedPathsStream.push(path))
	orderedPathsStream.end()
})

orderedPathsStream.flatMap(path => {
	return Bacon.fromNodeCallback(fs.readFile, path, { encoding: 'utf8' })
}).map(cheerio.load).map(convertCheerioToParsedVerses).forEach(thing => console.log(thing))

function convertCheerioToParsedVerses($) {
	var boldNormalId = boldNormalSelectorRegex.exec($.html())[1]

	var elements = []

	$('body').children('div').each((i, div) => {
		div = $(div)
		var boldNormal = boldNormalId === div.attr('id')
		var left = parseInt(div.css('left'))
		var prettyOffset = left > 133

		div.children('span').each((i, span) => {
			span = $(span)
			var text = span.text()
			var size = parseInt(span.css('font-size'))
			var verticalAlign = span.css('vertical-align')
			var bracketsInText = bracketsInTextRegex.exec(text)

			var type = 'UNKNOWN'

			if (boldNormal && size === 7) {
				type = 'chapter number'
			} else if (prettyOffset && bracketsInText) {
				type = 'header'
				text = bracketsInText[1]
			} else if (size === 3 && verticalAlign === 'super') {
				type = 'note number'
			} else if (size === 4 && verticalAlign === 'super') {
				type = 'note reference'
			} else if (size === 6 && verticalAlign === 'baseline') {
				type = 'verse'
			} else if (size === 5 && verticalAlign === 'baseline') {
				type = 'note'
			}

			elements.push({
				type: type,
				text: text
			})
		})
	})

	return elements
}
