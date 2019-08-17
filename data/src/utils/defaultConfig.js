module.exports = {
    userStats: function() {
            var userStatObj = {
                messageCount: 0,
                lastMessage: 0,
                spamStrike: 0
            }
            return JSON.stringify(userStatObj);
    },
    globalUserStats: function() {
        var globalUserStatObj = {
            messageCount: 0,
            lastMessage: 0,
            spamStrike: 0
        }
        return JSON.stringify(globalUserStatObj);
    },
    defaultChannelMeta: function() {
        var defaultChannelMetaObj = {
            name: null,
            id: null
        }
        return JSON.stringify(defaultChannelMetaObj);
    },
    serverSettings: function() {
        var settingsObj = {
            announcements: true,
            mentions: true
        }
        return JSON.stringify(settingsObj);
    },
    userSettings: function() {
        var settingsObj = {
            mentions: true
        }
        return JSON.stringify(settingsObj);

    }
}