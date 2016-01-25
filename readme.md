A programmatic version of Pickering's Majority Text translation of Revelation.

To run the conversion scripts, install [xpdf](http://www.foolabs.com/xpdf/download.html) first.

`require`ing the package returns an object with two properties: `versesNoteReferencesAndHeaders` and `notes`.

You can also require `pickering-majority-text-revelation/verses-note-references-and-headers.json` and `pickering-majority-text-revelation/notes.json` directly.

```js
var revelation = require('pickering-majority-text-revelation')

revelation.versesNoteReferencesAndHeaders.slice(0, 10)
/*
[ { type: 'note reference', identifier: '21343603963032365' },
  { type: 'header', text: 'Introduction' },
  { type: 'verse',
    chapterNumber: 1,
    verseNumber: 1,
    text: 'Jesus Christ’s revelation, which God gave Him to show to His slaves' },
  { type: 'note reference', identifier: '048827667720615864' },
  { type: 'verse',
    chapterNumber: 1,
    verseNumber: 1,
    text: '—things that must occur shortly.' },
  { type: 'note reference', identifier: '15470158657990396' },
  { type: 'verse',
    chapterNumber: 1,
    verseNumber: 1,
    text: 'And He communicated it, sending it by His angel to His slave John,' },
  { type: 'verse',
    chapterNumber: 1,
    verseNumber: 2,
    text: 'who gave witness to the word of God, even the testimony of Jesus Christ' },
  { type: 'note reference', identifier: '13911313470453024' },
  { type: 'verse',
    chapterNumber: 1,
    verseNumber: 2,
    text: '—the things that He saw,' } ]
*/

Object.keys(revelation.notes).slice(0, 10).reduce((memo, key) => { memo[key] = revelation.notes[key]; return memo }, {})

/*
{ '21343603963032365': 'Both the translation and the comments are the responsibility of Wilbur N. Pickering, ThM PhD, ©, being based on his edition of the Greek New Testament, according to the only significant line of transmission, both ancient and independent, that has a demonstrable archetypal form in all 27 books. The Greek Text of which this is a translation, and articles explaining the preference, may be downloaded free from  www.prunch.org.',
  '048827667720615864': 'Whose, the Father’s or the Son’s? Probably the Son’s, but in practice it makes little or no difference. Yes, the Text says “slaves”, so this book is not intended for the merely curious.',
  '15470158657990396': 'The Text actually says, “with speed”. Since to God 1000 years = one day, it has only been two days!',
  '13911313470453024': 'Any testimony of Jesus Christ is a word of God.',
  '9997173568699509': 'Most, if not all, versions have ‘he saw’ (referring to John, not Jesus) and omit the rest of the verse. The manuscript evidence is seriously divided at this point. My translation reflects two of the three main independent lines of transmission, including the best one (as I see it). See 22:20, “He who testifies to these things says, ‘Yes, I am coming swiftly!’ Oh yes!! Come Lord Jesus!” The whole book is what Jesus Christ is testifying, is revealing; as an eye witness. So the whole book is inspired.',
  '8110600898507982': 'John is evidently claiming divine inspiration for what he is writing. You won’t be blessed for reading or hearing a newspaper or a magazine. Notice that one person is reading (aloud) and a number of people are hearing, which was the norm in the congregations, since very few could afford to have a private copy of Scripture. Notice further that it is necessary to “keep” what is written.',
  '5140137709677219': 'The sequence “from..., and from..., and from...” suggests three persons. The third, “Jesus Christ”, has to be the Son. “The seven-fold Spirit” would be the Holy Spirit. So “Him who is, was and is coming” must be the Father. Just over half of the Greek MSS add ‘God’ after the first “from” to make the connection overt (but the best line of transmission does not).',
  '7795873954892159': 'Although the evidence is badly divided, I take it that the original reading is “the seven spirits which is”. A plural subject with a singular verb is anomalous, unless we understand “seven-fold Spirit which is”. If the Deity is three in one, why might not the Holy Spirit be seven in one? See Isaiah 11:2.',
  '09126864839345217': 'When and how was He “the faithful witness”? Throughout His life on earth He was the faithful witness to the Father’s character, what the Father was doing (John 5:19), what the Father was saying (John 12:50). Here He is the faithful witness to what is going to happen.',
  '6830810108222067': 'We have two readings here: one is clearly “from among the dead” while the other is ambiguous, meaning either “from among the dead” or ‘of the dead’. With the latter option, “firstborn” could have the derived meaning of ‘lord’ or ‘boss’. I take it that the better option is to follow the best line of transmission and read “from among”, in which case “firstborn” has its primary meaning. Death is pictured as a huge womb, pregnant with all the dead, and Jesus Christ was the first one out, literally the “firstborn”—but only the first! Because Jesus conquered death, we too may emerge from that ‘womb’. Thank you Lord!' }
*/

```
