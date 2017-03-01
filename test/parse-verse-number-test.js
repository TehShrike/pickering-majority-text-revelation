var parseVerse = require('../convertor/parse-verse-number')
var assert = require('power-assert')

function test(f) {
	f(assert)
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

test(t => {
	const output = parseVerse(10, ':1 And I heard a loud')
	t.equal(output.verseNumber, 1)
	t.equal(output.verses.length, 1)
	t.equal(output.verses[0].text, 'And I heard a loud')
})

test(t => {
	const { verseNumber, verses } = parseVerse(10, 'number is 666.')
	t.equal(verseNumber, 10)
	t.equal(verses.length, 1)
	t.equal(verses[0].text, 'number is 666.')
})
