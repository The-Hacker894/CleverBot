const Discord = require("discord.js");
const moment = require('moment')
const client = new Discord.Client({
    autoReconnect: true,
    messageCacheMaxSize: 10,
    messageCacheLifetime: 30,
    messageSweepInterval: 35
});
const config = require('./data/config.json')
const token = config.token
const DBLToken = config.dbltoken
const DBL = require('dblapi.js')
const dbl = new DBL(DBLToken)
const fs = require('fs')
const fse = require('fs-extra')
const package = require('./package.json')
const color = config.color
const cleverbot = require('cleverbot.io')
const clever = new cleverbot('eStbMZNduqG7EDbw', 'dvMd4iay4b5gFsQ904HTtIzH9NHVUdTo');

var corruptDetect = require("./data/src/utils/corruptionDetector.js")

var defaultChannelMeta = require("./data/src/utils/defaultConfig/channel.json")
var dCM = JSON.stringify(defaultChannelMeta, null, 2)

var defaultAlertSettingsMeta = require("./data/src/utils/defaultConfig/alertSettings.json")
var dASM = JSON.stringify(defaultAlertSettingsMeta)

function exit() {
    process.exit(0)
}

var blPath = {
    supportServer: "./data/blacklist/support/server.json",
    supportUser: "./data/blacklist/support/user.json"
}

const getDefaultChannel = (guild) => {
    // get "original" default channel
    if (guild.channels.has(guild.id))
        return guild.channels.get(guild.id)
    // Check for a "general" channel, which is often default chat
    const generalChannel = guild.channels.find(channel => channel.name === "general");
    if (generalChannel)
        return generalChannel;
    // Now we get into the heavy stuff: first channel in order where the bot can speak
    // hold on to your hats!
    return guild.channels
        .filter(c => c.type === "text" &&
            c.permissionsFor(guild.client.user).has("SEND_MESSAGES"))
        .sort((a, b) => a.position - b.position ||
            Long.fromString(a.id).sub(Long.fromString(b.id)).toNumber())
        .first();
}


client.on("ready", () => {

    function statUpdate() {
        delete require.cache[require.resolve('./data/cache/stats.json')]                          
        var stats = require(`./data/cache/stats.json`)

        client.shard.fetchClientValues('guilds.size')
            .then(results => {
                var res = results.reduce((prev, guildCount) => prev + guildCount, 0)

                    shardCount = parseInt(stats.shardCount)
                    try {
                        dbl.postStats(client.guilds.size, client.shard.id, shardCount)
                    } catch (ex) {
                    }
                
                client.user.setActivity('you on ' + res + ' servers', {
                    type: 'LISTENING'
                })
                
                if (!isNaN(parseInt(res))) {
            
                    stats.guildCount = parseInt(res)

                    fs.writeFile(`./data/cache/stats.json`, JSON.stringify(stats, null, 2), function (err) {
                        if (err) return console.log(err)
                    })
                }
            }) 
        return console.log(`[STATS] Stats Updated -- [SHARD #] ${client.shard.id}`)
    }

    statUpdate()
    setInterval(statUpdate, 120000)

    console.log('[Logged In] ' + client.user.tag)
    console.log('[Time] ' + moment().format('MMMM Do YYYY, h:mm:ss a'))
    console.log(`[Shard #] ${client.shard.id}`)
})

client.on("message", (message) => {
    // This is used for inits
    if (!fs.existsSync(`./data/serverdata`)) {
        fs.mkdirSync(`./data/serverdata`)
    }
    if (message.channel.type !== "dm") {
        if (!fs.existsSync(`./data/serverdata/${message.guild.id}`)) {
            fs.mkdirSync(`./data/serverdata/${message.guild.id}`)
        }
        if (!fs.existsSync(`./data/serverdata/${message.guild.id}/alertSettings.json`)) {
            if (!fs.existsSync(`./data/serverdata/${message.guild.id}`)) {
                fs.mkdirSync(`./data/serverdata/${message.guild.id}`)
            }
            fs.writeFile(`./data/serverdata/${message.guild.id}/alertSettings.json`, dASM, function (err) {
                delete require.cache[require.resolve('./data/src/strings/main.json')]                          
                var strings = require('./data/src/strings/main.json')
                if (err) return message.channel.send(strings.error.unexpected + err)
            })
        }
    }


})


client.on("message", (message) => {
    if (!message.channel.type == 'dm') {

        if (!fs.existsSync(`./data/serverdata/${message.guild.id}`)) {
            fs.mkdirSync(`./data/serverdata/${message.guild.id}`)
        }

        if (!fs.existsSync(`./data/serverdata/${message.guild.id}/alertSettings.json`)) {
            if (!fs.existsSync(`./data/serverdata/${message.guild.id}`)) {
                fs.mkdirSync(`./data/serverdata/${message.guild.id}`)
            }
            fs.writeFile(`./data/serverdata/${message.guild.id}/alertSettings.json`, dASM, function (err) {
                delete require.cache[require.resolve('./data/src/strings/main.json')]                          
                var strings = require('./data/src/strings/main.json')
                if (err) return message.channel.send(strings.error.unexpected + err)
            })
        }
        if (!fs.existsSync(`./data/serverdata/${message.guild.id}/channel.json`)) {
            fs.writeFileSync(`./data/serverdata/${message.guild.id}/channel.json`, dCM, function (err) {
                delete require.cache[require.resolve('./data/src/strings/main.json')]                          
                var strings = require('./data/src/strings/main.json')
                if (err) return console.log(strings.error.unexpected + err)
            })
        }
        if (!fs.existsSync(`./data/serverdata/${message.guild.id}/${message.author.id}`)) {
            fs.mkdirSync(`./data/serverdata/${message.guild.id}/${message.author.id}`)
        }
    }
})

clever.setNick("CleverBot")
client.on("message", (message) => {

    const prefixMention = new RegExp(`^<@!?${client.user.id}>`);
    const prefix = message.content.match(prefixMention) ? message.content.match(prefixMention)[0] : config.testString;


    const args = message.content.split(" ");

    if (message.author.bot) return;
    if (message.author == client.user) return;

    var cmd = message.content
    /* Commands */
    if (cmd.startsWith(`${prefix} stop`)) {
        if (message.author.id !== "270375857384587264") return;
        client.shard.broadcastEval('process.exit();');
        return;
    }
    if (cmd.startsWith(`${prefix} ping`)) {
        var pingstart = new Discord.RichEmbed()
            .setDescription('Pinging...')
            .setAuthor(message.author.username, message.author.displayAvatarURL)
        message.channel.send({
            embed: pingstart
        }).then(sent => {
            var pinged = new Discord.RichEmbed()
                .setTitle('**Pong!**')
                .setDescription(`${sent.createdTimestamp - message.createdTimestamp}ms`)
            sent.edit({
                embed: pinged
            })
        })
        return;
    }
    if (cmd.startsWith(`${prefix} privacy`)) {
        delete require.cache[require.resolve('./data/src/utils/embed.js')]
        var embedUtil = require("./data/src/utils/embed.js")
        return message.channel.send({
            embed: embedUtil.privacy()
        })
    }
    if (cmd.startsWith(`${prefix} support`)) return message.channel.send("This command has been moved to `feedback`")
    if (cmd.startsWith(`${prefix} feedback`)) {
        var userblacklist = require(blPath.supportUser)
        var serverblacklist = require(blPath.supportUser)
        if (userblacklist.some(ubl => message.author.id.includes(ubl))) return message.channel.send('Your ID has been blacklisted for this command')
        if (serverblacklist.some(sbl => message.guild.id.includes(sbl))) return message.channel.send('Your Server has been blacklisted for this command')

        var supportMessage = message.content.split(/\s+/g).slice(2).join(" ");
        delete require.cache[require.resolve('./data/src/utils/embed.js')]
        var embedUtil = require("./data/src/utils/embed.js")

        if (supportMessage.length < 1) return message.channel.send({
            embed: embedUtil.supportHelp(client)
        })

        var dataObj = {
            message: supportMessage,
            authorTag: message.author.tag,
            authorID: message.author.id,
        }
        
        delete require.cache[require.resolve('./data/src/strings/main.json')]                          
        var strings = require('./data/src/strings/main.json')

        message.channel.send(strings.cmd.support.confirmation)
        embedUtil.feedback(dataObj, client, message)
        return;

    }
    if (cmd.startsWith(`${prefix} settings`)) return message.channel.send("This command has moved to `toggle`")
    if (cmd.startsWith(`${prefix} toggle`)) {
        // Toggle command
        delete require.cache[require.resolve('./data/src/strings/main.json')]                          
        var strings = require('./data/src/strings/main.json')

        if(message.channel.type == "dm") return message.channel.send(strings.error.dmToggle)
        if (!fs.existsSync(`./data/serverdata/${message.guild.id}`)) {
            fs.mkdir(`./data/serverdata/${message.guild.id}`)
        }
        if (!fs.existsSync(`./data/serverdata/${message.guild.id}/alertSettings.json`)) {
            if (!fs.existsSync(`./data/serverdata/${message.guild.id}`)) {
                fs.mkdirSync(`./data/serverdata/${message.guild.id}`)
            }
            fs.writeFile(`./data/serverdata/${message.guild.id}/alertSettings.json`, dASM, function (err) {     
                delete require.cache[require.resolve('./data/src/strings/main.json')]                          
                var strings = require('./data/src/strings/main.json')
                if (err) return message.channel.send(strings.error.unexpected + err)
            })
        }
        
        
        function getDesc(suffPerms) {
            delete require.cache[require.resolve('./data/src/strings/main.json')]                          
            var strings = require('./data/src/strings/main.json')
            var sufficientPerms = strings.cmd.toggle.desc.sufficientPerms
            var insufficientPerms = strings.cmd.toggle.desc.insufficientPerms

            if (!suffPerms) insufficientPerms;
            if (suffPerms) return sufficientPerms;
            return sufficientPerms;
            
        }

        var p = true

        if (!message.member.hasPermission('MANAGE_CHANNELS')) {
            p = false
        }
        if (message.member.hasPermission('MANAGE_CHANNELS')) {
            p = true
        }

        var info = new Discord.RichEmbed()
            .setColor(config.color)
            .setTitle("Toggle")
            .setDescription(getDesc(p) +
                "`toggle maintenance` - **Toggles On/Off maintenance alerts for your server**\n" +
                "`toggle patreon` - **Toggles On/Off patreon reminders for your server**")
            .setAuthor(message.guild.name, message.guild.iconURL)

        var setting = args[2]

        if (!setting) return message.channel.send(info)

        fs.readFile(`./data/serverdata/${message.guild.id}/alertSettings.json`, 'utf8', function (err, alertSettings) {

            alertSettings = JSON.parse(alertSettings)
            corruptDetect.check(alertSettings, message)

            if (setting.includes("maintenance")) { // Toggle Maintenance Alerts (Default is disable = false)
                delete require.cache[require.resolve('./data/src/strings/main.json')]                          
                var strings = require('./data/src/strings/main.json')
                if (!p) return message.channel.send(strings.error.manageChannelsPermReq)

                if (alertSettings.disableMaintenance == false) {
                    // Change to true aka Disable Maintenance Alerts

                    defaultAlertSettingsMeta = {
                        disableMaintenance: true,
                        disablePatreon: alertSettings.disablePatreon
                    }
                    var newAlertSettings = JSON.stringify(defaultAlertSettingsMeta)

                    fs.writeFile(`./data/serverdata/${message.guild.id}/alertSettings.json`, newAlertSettings, function (err) {
                        message.channel.send("Successfully disabled Maintenance Alerts")
                    })
                    return;
                }
                // Change to false aka Enable Maintenance Alerts

                defaultAlertSettingsMeta = {
                    disableMaintenance: false,
                    disablePatreon: alertSettings.disablePatreon
                }
                var newAlertSettings = JSON.stringify(defaultAlertSettingsMeta)

                fs.writeFile(`./data/serverdata/${message.guild.id}/alertSettings.json`, newAlertSettings, function (err) {
                    delete require.cache[require.resolve('./data/src/strings/main.json')]                          
                    var strings = require('./data/src/strings/main.json')
                    message.channel.send(strings.confirm.enabledMaintenanceAlerts)
                })

                return;
            }
            if (setting.includes("patreon") || setting.includes("upvote") || setting.includes("donate")) {
                // Toggle Patreon Alerts (Default is disable = false)
                if (!p) return message.channel.send("You do not have the `MANAGE_CHANNELS` permission. Please ask your server moderator to enable this.")

                if (alertSettings.disablePatreon == false) {
                    // Change to true aka Disable Patreon Alerts

                    defaultAlertSettingsMeta = {
                        disableMaintenance: alertSettings.disableMaintenance,
                        disablePatreon: true
                    }
                    var newAlertSettings = JSON.stringify(defaultAlertSettingsMeta)

                    fs.writeFile(`./data/serverdata/${message.guild.id}/alertSettings.json`, newAlertSettings, function (err) {
                        message.channel.send("Successfully disabled Patreon Alerts")
                    })
                    return;
                }
                // Change to false aka Enable Patreon Alerts

                defaultAlertSettingsMeta = {
                    disableMaintenance: alertSettings.disableMaintenance,
                    disablePatreon: false
                }
                var newAlertSettings = JSON.stringify(defaultAlertSettingsMeta)

                fs.writeFile(`./data/serverdata/${message.guild.id}/alertSettings.json`, newAlertSettings, function (err) {
                    message.channel.send("Successfully enabled Patreon Alerts")
                })
                return;
            }
            return message.channel.send({
                embed: info
            })
        })
        return;

    }

    if (cmd.startsWith(`${prefix} unbind`)) {
        // UnBind command
        delete require.cache[require.resolve('./data/src/strings/main.json')]                          
        var strings = require('./data/src/strings/main.json')
        if (message.channel.type == 'dm') return message.channel.send(strings.error.dmunBind) //This can't be used in a DM for obvious reason
        if(!fs.existsSync(`./data/serverdata/`)) {
            fs.mkdir(`./data/serverdata/`)
        }
        if(!fs.existsSync(`./data/serverdata/${message.guild.id}`)) {
            fs.mkdir(`./data/serverdata/${message.guild.id}`)
        }
        if(!fs.existsSync(`./data/serverdata/${message.guild.id}/alertSettings.json`)) {
            if(!fs.existsSync(`./data/serverdata/${message.guild.id}`)) {
                fs.mkdirSync(`./data/serverdata/${message.guild.id}`)
            }
            fs.writeFile(`./data/serverdata/${message.guild.id}/alertSettings.json`, dASM, function(err) {

            })
        }

        var metaObj = dCM
        try {
            if(!fs.existsSync(`./data/serverdata/${message.guild.id}/channel.json`)) return message.channel.send("Bound Channel not found")
            fs.readFile(`./data/serverdata/${message.guild.id}/channel.json`, "utf8", function(err, data) {
            
            corruptDetect.check(data, message)
            
                data = JSON.parse(data)
                
                if(data.id == null) return message.channel.send(strings.error.noBoundChannel)
                if(data.name == null) return message.channel.send(strings.error.noBoundChannel)
                if(data.id == "null") return message.channel.send(strings.error.noBoundChannel)
                if(data.name == "null") return message.channel.send(strings.error.noBoundChannel)
                if (!message.member.hasPermission('MANAGE_CHANNELS')) return message.channel.send(strings.error.manageChannelsPermReq).catch(console.error);

                fs.writeFile(`./data/serverdata/${message.guild.id}/channel.json`, metaObj, function(err) {
                    return message.channel.send("Successfully unbound channel <#" + data.id + "> . You can rebind channels using <@" + client.user.id + "> `bind`")
                    
                })
                return;
            })
            return;
        } catch (ex) {
            return message.channel.send(strings.error.unexpected + ex)
        }
        return;
    }
    if (cmd.startsWith(`${prefix} bind`)) {
        //Bind Command
        delete require.cache[require.resolve('./data/src/strings/main.json')]                          
        var strings = require('./data/src/strings/main.json')
        if (message.channel.type == 'dm') return message.channel.send(strings.error.dmBind) //This can't be used in a DM for obvious reason

        var channelID = message.content.split(/\s+/g).slice(2).join(" ");
        var Channel = client.channels.find(channel => channel.id === channelID)

        if(channelID.length < 1) {
            Channel = client.channels.find(channel => channel.id === message.channel.id)
        }
        
        if (channelID.startsWith('<#') && channelID.endsWith('>')) {
            Channel = client.channels.find(channel => channel.id === channelID.substr(2).slice(0, -1))
        }
        if(!Channel) return message.channel.send(strings.error.channel404)
        if (!fs.existsSync(`./data/serverdata/`)) {
            fs.mkdir(`./data/serverdata/`)
        }
        if (!fs.existsSync(`./data/serverdata/${message.guild.id}`)) {
            fs.mkdir(`./data/serverdata/${message.guild.id}`)
        }
        if (!fs.existsSync(`./data/serverdata/${message.guild.id}/alertSettings.json`)) {
            if (!fs.existsSync(`./data/serverdata/${message.guild.id}`)) {
                fs.mkdirSync(`./data/serverdata/${message.guild.id}`)
            }
            fs.writeFile(`./data/serverdata/${message.guild.id}/alertSettings.json`, dASM, function (err) {
            })
        }
        var channelMeta = {
            name: Channel.name,
            id: Channel.id
        }
        var metaObj = JSON.stringify(channelMeta, null, 2)
        
            fs.writeFile(`./data/serverdata/${message.guild.id}/channel.json`, metaObj, function (err) {
                message.channel.send('Bound to Channel <#' + Channel.id + '>\n\nTo chat with me, just send a message in that channel and I\'ll respond to you.')
                if(message.channel.id !== Channel.id) {
                    try {
                        Channel.send('**' + message.author.tag + '** bound me to this channel')
                    } catch (ex) {
                        return;
                    }
                }  
            })
            return;
    }
    if (cmd.startsWith(`${prefix} restart`)) {
        delete require.cache[require.resolve('./data/src/strings/main.json')]                          
        var strings = require('./data/src/strings/main.json')
        if (message.author.id !== strings.botOwner) return;
        exit()
    }
    if (cmd.startsWith(`${prefix} credits`)) {
        delete require.cache[require.resolve('./data/src/utils/embed.js')]
        var embedUtil = require("./data/src/utils/embed.js")
        return message.channel.send({
            embed: embedUtil.credits()
        })
    }
    if (cmd.startsWith(`${prefix} lockdown`)) {
        delete require.cache[require.resolve('./data/src/strings/main.json')]                          
        var strings = require('./data/src/strings/main.json')
        if (message.author.id !== strings.botOwner) return;
        var mode = args[2]
        if(!mode) {
            delete require.cache[require.resolve('./data/src/utils/embed.js')]
            var embedUtil = require("./data/src/utils/embed.js")
            return message.channel.send({
                embed: embedUtil.lckdwn(client)
            })
        }
        var lockMsg = message.content.split("||");
            lockMsg = lockMsg[1]

        function lckdwn(m) {
            if(m.startsWith("enable")) {
                var lck = {
                    active: true,
                    msg: lockMsg
                }
                lck = JSON.stringify(lck)
                fs.writeFile('./data/src/lockdown.json', lck, function(err) {
                    message.channel.send("Lockdown has began! Use `lockdown end` to end the lockdown.")
                })
                return;
            }
            if(m.startsWith("disable")) {
                var lck = {
                    active: false,
                    msg: null
                }
                lck = JSON.stringify(lck)
                fs.writeFile('./data/src/lockdown.json', lck, function(err) {
                    message.channel.send("Lockdown has ended!")
                })
                return;
            }
        }
        lckdwn(mode)
        return;
    }
    if (cmd.startsWith(`${prefix} findchannel`)) {
        delete require.cache[require.resolve('./data/src/strings/main.json')]                          
        var strings = require('./data/src/strings/main.json')
        function callback(dm) {
            if(!dm) return message.channel.send(strings.error.noBoundChannel)
            return message.channel.send(strins.error.dmFindBind)
            
        }
        if (message.channel.type == 'dm') return callback()
        try {
            fs.readFile(`./data/serverdata/${message.guild.id}/channel.json`, "utf8", function (err, boundChannel) {
                var chnl = JSON.parse(boundChannel)

                corruptDetect.check(chnl, message)

                if (chnl.id == null) return callback()
                if (chnl.name == null) return callback()
                if (chnl.id == "null") return callback()
                if (chnl.name == "null") return callback()
                return message.channel.send("Your bound channel is <#" + chnl.id + ">");
            })
        } catch (ex) {
            callback()
        }
        return;
    }
    if (cmd.startsWith(`${prefix}`)) {
        delete require.cache[require.resolve('./data/src/utils/embed.js')]
        var embedUtil = require('./data/src/utils/embed.js')

        if (message.channel.type == 'dm') return message.channel.send({
            embed: embedUtil.welcome(client, false, message.channel)
        })

        if (message.channel.type == 'text') {
            if (fs.existsSync(`./data/serverdata/${message.guild.id}/channel.json`)) {
                fs.readFile(`./data/serverdata/${message.guild.id}/channel.json`, function (err, channelData) {

                    var dat = JSON.parse(channelData)

                    corruptDetect.check(dat, message)

                    return message.channel.send({
                        embed: embedUtil.welcome(client, dat, message.channel)
                    })
                });
            } else {
                return message.channel.send({
                    embed: embedUtil.welcome(client, false, message.channel)
                })
            }
        }
        return;
    } else {
        delete require.cache[require.resolve('./data/src/strings/main.json')]                          
        var strings = require('./data/src/strings/main.json')
        if (message.author.id == "579820311977918475") return;

        if (message.channel.type !== 'dm' && message.guild.id == "578241309765009418") return;
        if (message.author.id == "579820311977918475") return;

        alertSettings = null

        function respond() {
            try {
                message.channel.startTyping()
                clever.create(function (sessionerr, session) {
                    if (sessionerr) return message.channel.send(strings.error.unexpected + err).then(msg => {
                        msg.channel.stopTyping()
                    })
                    clever.ask(message.content, function (err, response) {
    
                        if (err) return message.channel.send(strings.error.unexpected + err).then(msg => {
                            msg.channel.stopTyping()
                        })
        
                        function sendResponse(msg, response, announcement) {
    
                            function decideIfMention(channel) {
                                if (channel.type == "dm") return "";
                                if (channel.type == "text") return `**${msg.author.tag}**, `
                            }
                            delete require.cache[require.resolve('./data/src/utils/embed.js')]
                            var embedUtil = require(`./data/src/utils/embed.js`)
    
                            var skipPatreon = false
                            var skipMA = false
    
                            if (message.channel.type !== "dm") {
                                delete require.cache[require.resolve(`./data/serverdata/${message.guild.id}/alertSettings.json`)]
                                var alertSettings = require(`./data/serverdata/${message.guild.id}/alertSettings.json`)
    
                                    corruptDetect.check(alertSettings, message)
    
                                    if (alertSettings.disablePatreon == true) {
                                        skipPatreon = true
                                    }
                                    if (alertSettings.disableMaintenance == true) {
                                        skipMA = true
                                    }
                            }
    
    
                            function defaultResponse() {
                                msg.channel.send(`${decideIfMention(msg.channel)}${response}`).then(msg => {
                                    msg.channel.stopTyping()
                                })
                                return;
                            }
    
                            function patreonResponse() {
                                if (Math.random() > parseInt(announcement.patreon.chance)) {
                                    return msg.channel.send(`${decideIfMention(msg.channel)}${response}`, {
                                        embed: embedUtil.support(announcement)
                                    }).then(msg => {
                                        msg.channel.stopTyping()
                                    })
    
                                }
                                defaultResponse()
                            }
    
                            function maintenanceResponse() {
    
                                if (Math.random() > parseInt(announcement.maintenance.chance)) {
                                    msg.channel.send(`${decideIfMention(msg.channel)}${response}`, {
                                        embed: embedUtil.maintenance(announcement)
                                    }).then(msg => {
                                        msg.channel.stopTyping()
                                    })
                                    return;
                                }
                                patreonResponse()
                            }
    
                            if (announcement.maintenance.active == false && skipPatreon == false) return patreonResponse()
                            if (announcement.maintenance.active == false && skipPatreon == true) return defaultResponse()
                            if (skipMA == true && skipPatreon == true) return defaultResponse()
                            if (skipMA == false && skipPatreon == true && announcement.maintenance.ative == true) return maintenanceResponse()
                            if (announcement.maintenance.active == true && skipMA == false) return maintenanceResponse()
                            return defaultResponse()
    
    
                        }
                        fs.readFile(`./data/src/announcement.json`, function (err, announcementDat) {
                            var announcementObj = JSON.parse(announcementDat)
                            return sendResponse(message, response, announcementObj);
                        });
                        return;
    
                        // End
                    });
                }); // End of CleverBot Init
    
                return;
            } catch (ex) {
                delete require.cache[require.resolve('./data/src/strings/main.json')]                          
                var strings = require('./data/src/strings/main.json')
                return message.channel.send(strings.error.unexpected + ex)
            }
        }

        delete require.cache[require.resolve(`./data/src/utils/ignoreTriggers.json`)]
        var ignoreTriggers = require(`./data/src/utils/ignoreTriggers.json`)
        if (ignoreTriggers.some(i => message.content.startsWith(i))) return;

        if (message.channel.type !== 'dm') {
            if (!fs.existsSync(`./data/serverdata/${message.guild.id}/channel.json`)) return;
            fs.readFile(`./data/serverdata/${message.guild.id}/channel.json`, 'utf8', function (err, newChannel) {
                var nChannel = JSON.parse(newChannel)
                corruptDetect.check(nChannel, message)

                var chatChannel = client.channels.find(channel => channel.id == nChannel.id)

                if (message.channel.id !== nChannel.id) return;
                if (message.content.length < 1) return;

                if (!fs.existsSync(`./data/serverdata/${message.guild.id}/alertSettings.json`)) {
                    if (!fs.existsSync(`./data/serverdata/${message.guild.id}`)) {
                        fs.mkdirSync(`./data/serverdata/${message.guild.id}`)
                    }
                    fs.writeFile(`./data/serverdata/${message.guild.id}/alertSettings.json`, dASM, function (err) {
                    })
                    alertSettings = JSON.parse(dASM)
                }
                if (!message.guild.me.hasPermission("SEND_MESSAGES")) return; // Checks to see if CleverBot can send messages in the guild
                if (!chatChannel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return; // Checks to see if CleverBot can send messages in the bound channel
                fs.readFile("./data/src/lockdown.json", 'utf8', function(err, lck) {
                    lck = JSON.parse(lck)
                    if(lck.active) {
                        delete require.cache[require.resolve('./data/src/utils/embed.js')]
                        var embedUtil = require("./data/src/utils/embed.js")
                        message.channel.send({embed: embedUtil.lockDownOn(lck.msg)})
                    }
                    if(!lck.active) {
                        respond()
                    }
                }) 
            });
            return;
        } 
       return respond()
        
    }
});
/* Commands */
client.on("guildCreate", (guild) => {
    delete require.cache[require.resolve('./data/src/utils/embed.js')]
    var embedUtil = require("./data/src/utils/embed.js")

    if (!fs.existsSync(`./data/serverdata/${guild.id}`)) {
        fs.mkdirSync(`./data/serverdata/${guild.id}`)
    }
    if (!fs.existsSync(`./data/serverdata/${guild.id}/channel.json`)) {
        fs.writeFileSync(`./data/serverdata/${guild.id}/channel.json`, dCM, function (err) {

        })
    }
    // Greeting Message

        try {
            const channel = getDefaultChannel(guild);
            channel.send({
                embed: embedUtil.greeting(client, guildCount)
            });
        } catch (ex) {

        }
})
client.on("guildDelete", (guild) => {
    if (fs.existsSync(`./data/serverdata/${guild.id}`)) {
        fse.remove(`./data/serverdata/${guild.id}`)
    }
})
client.on("error", (error) => {
    console.log(error)
})

client.on("disconnect", () => {
    setTimeout(() => {
        client.user || (
            client.login(config.token)
        );
    }, 15000);
})


client.login(config.token) //Login