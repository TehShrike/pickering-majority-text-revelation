var fs = require('fs')

var input = require('./very-basic-parsed.json')
var parseVerse = require('./parse-verse-number')

var relevant = input.filter(o => o.type !== 'UNKNOWN' && !(o.text && o.text.toLowerCase() === 'revelation'))

var currentChapterNumber = null
var currentVerseNumber = null
var currentNoteIdentifier = null
var currentNoteNumbersToUniqueIdentifier = {}
var noteIdentifiersToNotes = {}
var versesAndNoteReferencesAndHeaders = []

function addToNote(text) {
	if (!noteIdentifiersToNotes[currentNoteIdentifier]) {
		noteIdentifiersToNotes[currentNoteIdentifier] = []
	}

	noteIdentifiersToNotes[currentNoteIdentifier].push(text)
}

var paragraphisOpen = false

function startParagraphIfNoneIsOpen() {
	if (!paragraphisOpen) {
		paragraphisOpen = true
		versesAndNoteReferencesAndHeaders.push({
			type: 'start paragraph'
		})
	}
}

function closeParagraphIfAnyIsOpen() {
	if (paragraphisOpen) {
		paragraphisOpen = false
		versesAndNoteReferencesAndHeaders.push({
			type: 'end paragraph'
		})
	}
}

relevant.forEach(o => {
	if (o.type === 'verse') {
		startParagraphIfNoneIsOpen()
		var parsedVerseText = parseVerse(currentVerseNumber, o.text)
		currentVerseNumber = parsedVerseText.verseNumber
		versesAndNoteReferencesAndHeaders = versesAndNoteReferencesAndHeaders.concat(parsedVerseText.verses.map(o => {
			return {
				type: 'verse',
				verseNumber: o.verseNumber,
				chapterNumber: currentChapterNumber,
				text: o.text
			}
		}))
	} else if (o.type === 'chapter number') {
		closeParagraphIfAnyIsOpen()
		currentChapterNumber = parseInt(o.text)
		currentVerseNumber = 1
	} else if (o.type === 'note number') {
		var number = parseInt(o.text)
		currentNoteIdentifier = currentNoteNumbersToUniqueIdentifier[number]
	} else if (o.type === 'note reference') {
		var number = parseInt(o.text)
		var identifier = unique()
		currentNoteNumbersToUniqueIdentifier[number] = identifier
		versesAndNoteReferencesAndHeaders.push({
			type: 'note reference',
			identifier: identifier
		})
	} else if (o.type === 'verse') {
		startParagraphIfNoneIsOpen()
		versesAndNoteReferencesAndHeaders.push({
			type: 'verse',
			chapterNumber: currentChapterNumber,
			verseNumber: currentVerseNumber,
			text: o.text
		})
	} else if (o.type === 'note') {
		addToNote(o.text)
	} else if (o.type === 'header') {
		closeParagraphIfAnyIsOpen()
		versesAndNoteReferencesAndHeaders.push({
			type: 'header',
			text: o.text
		})
	} else if (o.type === 'paragraph break') {
		closeParagraphIfAnyIsOpen()
	}
})

function combineAdjacentVerseChunks(versesAndNoteReferencesAndHeaders) {
	var last = null
	var combinedVersesAndNoteReferencesAndHeaders = []
	function addVerseToResult(verse) {
		combinedVersesAndNoteReferencesAndHeaders.push({
			type: 'verse',
			chapterNumber: verse.chapterNumber,
			verseNumber: verse.verseNumber,
			text: verse.verseChunks.join(' ')
		})
	}
	versesAndNoteReferencesAndHeaders.forEach(o => {
		if (last && (o.type !== last.type
				|| o.verseNumber !== last.verseNumber
				|| o.chapterNumber !== last.chapterNumber)) {
			addVerseToResult(last)
			last = null
		}
		if (o.type === 'verse') {
			if (!last) {
				last = {
					type: 'verse',
					chapterNumber: o.chapterNumber,
					verseNumber: o.verseNumber,
					verseChunks: []
				}
			}
			last.verseChunks.push(o.text)
		} else {
			combinedVersesAndNoteReferencesAndHeaders.push(o)
		}
	})
	if (last) {
		addVerseToResult(last)
	}
	return combinedVersesAndNoteReferencesAndHeaders
}

function combineNoteArrays(noteIdentifiersToNotes) {
	var transformed = {}

	Object.keys(noteIdentifiersToNotes).forEach(identifier => {
		transformed[identifier] = noteIdentifiersToNotes[identifier].join(' ')
	})

	return transformed
}

function unique() {
	return Math.random().toString().slice(2)
}

fs.writeFileSync('./verses-note-references-and-headers.json', JSON.stringify(combineAdjacentVerseChunks(versesAndNoteReferencesAndHeaders)))
fs.writeFileSync('./notes.json', JSON.stringify(combineNoteArrays(noteIdentifiersToNotes)))

