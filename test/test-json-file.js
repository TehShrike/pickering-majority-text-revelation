const fileContents = require('fs').readFileSync('./revelation.json', { encoding: 'utf8' })

const array = JSON.parse(fileContents)

console.log('The JSON file is valid with', array.length, 'elements.')
