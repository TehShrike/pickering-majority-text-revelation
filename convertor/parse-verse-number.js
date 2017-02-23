const containsVerseNumber = /\d{1,2}/
const justVerseNumber = /^\s*:(\d{1,2})\s*$/

module.exports = function parseVerse(startingVerseNumber, text) {
	let currentVerseNumber = startingVerseNumber
	const verses = []

	// anything with more than 2 digits is not a verse number
	if (justVerseNumber.test(text)) {
		currentVerseNumber = parseInt(justVerseNumber.exec(text)[1])
	} else if (containsVerseNumber.test(text)) {
		let match = null
		const findToNextVerseNumber = /(.*?):?(\d{1,2})([^\d]*)/g
		while ((match = findToNextVerseNumber.exec(text)) !== null) {
			const firstVerseText = match[1].trim()
			const nextNumber = parseInt(match[2])
			const secondVerseText = match[3].trim()
			if (firstVerseText) {
				verses.push({
					verseNumber: currentVerseNumber,
					text: firstVerseText
				})
			}
			if (secondVerseText) {
				verses.push({
					verseNumber: nextNumber,
					text: secondVerseText
				})
			}

			currentVerseNumber = nextNumber
		}
	} else {
		verses.push({
			verseNumber: currentVerseNumber,
			text: text
		})
	}

	return {
		verseNumber: currentVerseNumber,
		verses: verses
	}
}
