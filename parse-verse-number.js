var containsVerseNumber = /\d{1,2}/
var justVerseNumber = /^\s*:(\d{1,2})\s*$/

module.exports = function parseVerse(startingVerseNumber, text) {
	var currentVerseNumber = startingVerseNumber
	var verses = []

	// anything with more than 2 digits is not a verse number
	if (justVerseNumber.test(text)) {
		 currentVerseNumber = parseInt(justVerseNumber.exec(text)[1])
	} else if (containsVerseNumber.test(text)) {
		var match = null
		var findToNextVerseNumber = /(.*?)(\d{1,2})([^\d]*)/g
		while ((match = findToNextVerseNumber.exec(text)) !== null) {
			var firstVerseText = match[1].trim()
			var nextNumber = parseInt(match[2])
			var secondVerseText = match[3].trim()
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
