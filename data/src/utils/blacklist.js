const fs = require('fs')

module.exports = {
    checkUserIfBlacklisted: function(userID) {
        fs.readFile("./data/blacklist/golbal/user.json", 'utf8', function(err, data) {
            data = JSON.parse(data)

            if(data.includes(userID)) return '1'
            if(!data.includes(userID)) return '2'
        })
    },
    checkServerIfBlacklisted: function(guildID) {
        fs.readFile("../../blacklist/global/server.json", 'utf8', function(err, data) {
            data = JSON.parse(data)
            if(data.includes(guildID)) return true
            if(!data.includes(guildID)) return false
        })
    }
}