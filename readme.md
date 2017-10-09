A fork of Wilbur Pickering's Majority Text translation of Revelation.

To suggest changes to the translation, edit [revelation.json](https://github.com/TehShrike/pickering-majority-text-revelation/blob/master/revelation.json).

# Minutia

For the programmatic version of Pickering's translation with his notes and without any alterations, see [the 1.x branch](https://github.com/TehShrike/pickering-majority-text-revelation/tree/1.x).

This translation is based on Pickering's revised translation, which can be downloaded from his web site [prunch.org](http://www.prunch.org/new-translation-of-the-nt.php).

For a list of changes made to Pickering's original translation, see [changelog.md](./changelog.md).

# License

Pickering's translation is licensed [Creative Commons Attribution-ShareAlike 3.0 Unported](https://creativecommons.org/licenses/by-sa/3.0/), and thus this fork is too.

# Example of the data

The raw data can be found in [revelation.json](./revelation.json).

It is published to npm as [revelation](https://www.npmjs.com/package/revelation).

The 1.x version is published to npm as [pickering-majority-text-revelation](https://www.npmjs.com/package/pickering-majority-text-revelation).

It is a JSON array that looks like this:

```json
[
  {
    "type": "header",
    "text": "Introduction"
  },
  {
    "type": "verse",
    "chapterNumber": 1,
    "verseNumber": 1,
    "text": "Jesus Christ’s revelation, which God gave Him to show to His slaves —things that must occur shortly. And He communicated it, sending it by His angel to His slave John,",
    "sectionNumber": 1
  },
  {
    "type": "verse",
    "chapterNumber": 1,
    "verseNumber": 2,
    "text": "who gave witness to the word of God, even the testimony of Jesus Christ —the things that He saw, both things that are and those that must happen after these.",
    "sectionNumber": 1
  },
  {
    "type": "verse",
    "chapterNumber": 1,
    "verseNumber": 3,
    "text": "Blessed is he who reads and those who hear the words of the prophecy, and keep the things that are written in it; because the time is near.",
    "sectionNumber": 1
  },
  {
    "type": "paragraph break"
  },
  {
    "type": "verse",
    "chapterNumber": 1,
    "verseNumber": 4,
    "text": "John, to the seven churches that are in Asia: Grace and peace to you from Him who is and who was and who is coming, and from the seven-fold Spirit who is before His throne,",
    "sectionNumber": 1
  }
]
```

# Markdown

A markdown version of the translation is available in [revelation.md](./revelation.md).
