const fs = require('fs')
var config = require('./data/config.json')

config.token = ""

fs.writeFile('./data/config.json', JSON.stringify(config, null, 2), function(err) {
    if(err) return console.log(err)
    
})
delete require.cache[require.resolve('./data/config.json')]

setTimeout( () => {
    config.dbltoken = ""

    fs.writeFile('./data/config.json', JSON.stringify(config, null, 2), function(err) {
        if(err) return console.log(err)
        return console.log("Wiped Tokens Successfully!")
    })
}, 5000)



