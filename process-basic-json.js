var input = require('./very-basic-parsed.json')
var parseVerse = require('./parse-verse-number')

var relevant = input.filter(o => o.type !== 'UNKNOWN' && o.text.toLowerCase() !== 'revelation')

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

relevant.forEach(o => {
	if (o.type === 'verse') {
		var parsedVerseText = parseVerse(currentVerseNumber, o.text)
		currentVerseNumber = parsedVerseText.verseNumber
		versesAndNoteReferencesAndHeaders = versesAndNoteReferencesAndHeaders.concat(parsedVerseText.verses.map(o => {
			return {
				verseNumber: o.verseNumber,
				chapterNumber: currentChapterNumber,
				text: o.text
			}
		}))
	} else if (o.type === 'chapter number') {
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
		versesAndNoteReferencesAndHeaders.push({
			type: 'verse',
			chapterNumber: currentChapterNumber,
			verseNumber: currentVerseNumber,
			text: o.text
		})
	} else if (o.type === 'note') {
		addToNote(o.text)
	} else if (o.type === 'header') {
		versesAndNoteReferencesAndHeaders.push({
			type: 'header',
			text: o.text
		})
	}
})

function unique() {
	return Math.random().toString().slice(2)
}

console.log(versesAndNoteReferencesAndHeaders)
console.log(noteIdentifiersToNotes)