const fs = require('fs')

const parseVerse = require('./parse-verse-number')

const input = require('../very-basic-parsed.json')

const { versesAndNoteReferencesAndHeaders } = processBasicDataStructure(input)

const appropriatelyChunkedVerses = flatMap(combineAdjacentVerseChunks(versesAndNoteReferencesAndHeaders), splitVerseIfNecessary)
write('verses-note-references-and-headers', addVerseSectionNumbers(appropriatelyChunkedVerses))

function combineAdjacentVerseChunks(versesAndNoteReferencesAndHeaders) {
	let last = null
	const combinedVersesAndNoteReferencesAndHeaders = []

	function addVerseToResult(verse) {
		combinedVersesAndNoteReferencesAndHeaders.push({
			type: 'verse',
			chapterNumber: verse.chapterNumber,
			verseNumber: verse.verseNumber,
			text: joinVerseChunks(verse.verseChunks.map(str => str.trim()))
		})
	}

	versesAndNoteReferencesAndHeaders.filter(({ type }) => {
		return type !== 'note number' && type !== 'note reference'
	}).forEach(o => {
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

function flatMap(ary, mapFn) {
	const output = []

	ary.forEach(item => {
		const mapResult = mapFn(item)
		if (Array.isArray(mapResult)) {
			mapResult.forEach(item => output.push(item))
		} else {
			output.push(mapResult)
		}
	})

	return output
}

function processBasicDataStructure(input) {
	let currentChapterNumber = null
	let currentVerseNumber = null
	let currentNoteIdentifier = null
	let currentNoteNumbersToUniqueIdentifier = {}
	let noteIdentifiersToNotes = {}
	let versesAndNoteReferencesAndHeaders = []
	let lastIdentifier = 0
	let paragraphisOpen = false

	function unique() {
		lastIdentifier++

		return lastIdentifier.toString()
	}

	function addToNote(text) {
		if (!noteIdentifiersToNotes[currentNoteIdentifier]) {
			noteIdentifiersToNotes[currentNoteIdentifier] = []
		}

		noteIdentifiersToNotes[currentNoteIdentifier].push(text)
	}

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


	const relevant = input.filter(o => o.type !== 'UNKNOWN' && !(o.text && o.text.toLowerCase() === 'revelation'))

	relevant.forEach(o => {
		if (o.type === 'verse') {
			startParagraphIfNoneIsOpen()
			const parsedVerseText = parseVerse(currentVerseNumber, o.text)
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
			const number = parseInt(o.text)
			currentNoteIdentifier = currentNoteNumbersToUniqueIdentifier[number]
		} else if (o.type === 'note reference') {
			const number = parseInt(o.text)
			const identifier = unique()
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

	closeParagraphIfAnyIsOpen()

	return { versesAndNoteReferencesAndHeaders, noteIdentifiersToNotes }
}

function write(file, data) {
	fs.writeFileSync(`./${file}.json`, JSON.stringify(data, null, '\t'))
}

function splitVerseIfNecessary(verse) {
	if (verse.chapterNumber === 12 && verse.verseNumber === 17) {
		return chunk(verse, [
			'So the dragon was furious about the woman and off he went to make war with the rest of her offspring,',
			'those who keep the commands of God and hold the testimony of Jesus.'
		])
	} else {
		return verse
	}
}

function chunk(verse, chunks) {
	return chunks.map(text => Object.assign({}, verse, { text }))
}

function addVerseSectionNumbers(verses) {
	let lastVerseNumber = 0
	let sectionNumber = 0

	return verses.map(chunk => {
		if (chunk.type !== 'verse') {
			return chunk
		}

		if (chunk.verseNumber !== lastVerseNumber) {
			sectionNumber = 0
		}
		sectionNumber++
		lastVerseNumber = chunk.verseNumber
		return Object.assign({}, chunk, { sectionNumber })
	})
}

function joinVerseChunks(strings) {
	return strings.reduce((sentence, string) => {
		const startsWithPunctuation = /^[\.,]/.test(string)
		const endsWithDash = /[-—]$/.test(sentence)

		const needsLeadingSpace = sentence.length > 0
			&& !startsWithPunctuation
			&& !endsWithDash

		const addition = needsLeadingSpace ? (' ' + string) : string

		return sentence + addition
	})
}
