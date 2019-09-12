var strings = require('../strings/main.json')
// CleverBot Embed Utility

module.exports = {
    check: function (channelData, msg) {
        try {
            var g = null
            if (/^[\],:{}\s]*$/.test(channelData.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                g = true
            } else {
                g = false
                msg.channel.send(strings.error.corruptDBFile)
                return fs.unlink(`./data/serverdata/${msg.guild.id}/channel.json`)
            }
        } catch (ex) {
            
        }
    }
}