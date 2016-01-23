var parseVerse = require('./parse-verse-number')
var assert = require('assert')

function test(f) {
	assert.doesNotThrow(() => f(assert))
}

test(t => {
	var output = parseVerse(9, '10 Do not fear any of the things that you are about to suffer: Take')
	t.equal(output.verseNumber, 10)
	t.equal(output.verses.length, 1)
	t.equal(output.verses[0].verseNumber, 10)
	t.equal(output.verses[0].text, 'Do not fear any of the things that you are about to suffer: Take')
})

test(t => {
	var output = parseVerse(9, 'Do not fear any of the things 10 that you are about to suffer: Take')
	t.equal(output.verseNumber, 10)
	t.equal(output.verses.length, 2)

	t.equal(output.verses[0].verseNumber, 9)
	t.equal(output.verses[0].text, 'Do not fear any of the things')

	t.equal(output.verses[1].verseNumber, 10)
	t.equal(output.verses[1].text, 'that you are about to suffer: Take')
})

test(t => {
	var output = parseVerse(9, 'Do not fear any of the things 10 that you are about to suffer: Take 11')
	t.equal(output.verseNumber, 11)
	t.equal(output.verses.length, 2)

	t.equal(output.verses[0].verseNumber, 9)
	t.equal(output.verses[0].text, 'Do not fear any of the things')

	t.equal(output.verses[1].verseNumber, 10)
	t.equal(output.verses[1].text, 'that you are about to suffer: Take')
})

test(t => {
	var output = parseVerse(9, '10 Do not fear any of the things 11 that you are about to suffer: Take 12')
	t.equal(output.verseNumber, 12)
	t.equal(output.verses.length, 2)

	t.equal(output.verses[0].verseNumber, 10)
	t.equal(output.verses[0].text, 'Do not fear any of the things')

	t.equal(output.verses[1].verseNumber, 11)
	t.equal(output.verses[1].text, 'that you are about to suffer: Take')
})

test(t => {
	var output = parseVerse(9, 'Do not fear')
	t.equal(output.verseNumber, 9)
	t.equal(output.verses.length, 1)

	t.equal(output.verses[0].verseNumber, 9)
	t.equal(output.verses[0].text, 'Do not fear')
})

test(t => {
	var output = parseVerse(9, ':1 ')
	t.equal(output.verseNumber, 1)
	t.equal(output.verses.length, 0)
})
