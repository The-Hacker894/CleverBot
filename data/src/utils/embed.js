const Discord = require('discord.js');
const RichEmbed = require('discord.js').RichEmbed;
var config = require('../../config.json')

// CleverBot Embed Utility

module.exports = {
    helloWorld: function () {
        delete require.cache[require.resolve('../strings/main.json')]
        var strings = require('../strings/main.json')
        var e = {
            color: 0x0099ff,
	title: 'Some title',
	url: 'https://discord.js.org',
	author: {
		name: 'Some name',
		icon_url: 'https://i.imgur.com/wSTFkRM.png',
		url: 'https://discord.js.org',
	},
	description: 'Some description here',
	thumbnail: {
		url: 'https://i.imgur.com/wSTFkRM.png',
	},
	fields: [
		{
			name: 'Regular field title',
			value: 'Some value here',
		},
		{
			name: '\u200b',
			value: '\u200b',
		},
		{
			name: 'Inline field title',
			value: 'Some value here',
			inline: true,
		},
		{
			name: 'Inline field title',
			value: 'Some value here',
			inline: true,
		},
		{
			name: 'Inline field title',
			value: 'Some value here',
			inline: true,
		},
	],
	image: {
		url: 'https://i.imgur.com/wSTFkRM.png',
	},
	timestamp: new Date(),
	footer: {
		text: 'Some footer text here',
		icon_url: 'https://i.imgur.com/wSTFkRM.png',
	},
        }
        return e;
    },
    privacy: function() {
        delete require.cache[require.resolve('../strings/main.json')]
        var strings = require('../strings/main.json')
        var e = {
            title: strings.privacy.title,
            description: strings.privacy.desc,
            color: 0x6ABAFF,
            fields: [
                {
                    name: strings.privacy.messages.title,
                    value: strings.privacy.messages.desc
                },
                {
                    name: strings.privacy.channels.title,
                    value: strings.privacy.channels.desc
                },
                {
                    name: strings.privacy.ids.title,
                    value: strings.privacy.ids.desc
                },
                {
                    name: strings.privacy.interactions.title,
                    value: strings.privacy.interactions.desc
                },
            ],
            footer: {
                text: strings.privacy.footer
            }
        }
        return e;
    },
    supportHelp: function(c) {
        delete require.cache[require.resolve('../strings/main.json')]
        var strings = require('../strings/main.json')
        var e = {
            title: "Support",
            description: strings.cmd.support.desc,
            color: 0x6ABAFF,
            author: {
                name: c.user.username,
                icon_url: c.user.avatarURL
              }
        }
        return e;
    },
    credits: function() {
        delete require.cache[require.resolve('../strings/main.json')]
        var strings = require('../strings/main.json')
        var e = {
            title: "Credits",
            color: 0x6ABAFF,
            description: strings.welcome.credits.desc,
            fields: [
                {
                    name: "CleverBot.io",
                    value: "[By dtester and the CleverBot.io team](https://www.npmjs.com/package/cleverbot.io)"
                },
                {
                    name: "DiscordJS",
                    value: "[Started by hydrabolt and maintained by the DJS Team](https://www.npmjs.com/package/discord.js)"
                },
                {
                    name: "fs-extra",
                    value: "[By jprichardson, ryanzim, and manidlou](https://www.npmjs.com/package/fs-extra)"
                },
                {
                    name: "moment",
                    value: "[By the momentjs team](https://www.npmjs.com/package/moment)",
                }
                
            ],
            footer :{
                text: "Most importantly the support of everyone who decided to invite CleverBot to their Discord Servers :)"
            }
        }
        return e;
    },
    welcome: function(client, dat, channel) {
        delete require.cache[require.resolve('../strings/main.json')]
        var strings = require('../strings/main.json')
        var e = new Discord.RichEmbed()
        .setColor(config.color)
        .setTitle(client.user.tag)
        .setDescription(strings.welcome.desc)

        
        
        if (channel.type == "text") {
            if (!client.channels.exists(channel => channel.id === dat.id)) {
                e.addField(`${strings.welcome.getting_started_text.title}`,  `${strings.welcome.getting_started_text.desc}`, true)
            }
            if (client.channels.exists(channel => channel.id === dat.id)) {
                e.addField(`${strings.welcome.feedback.title}`, `${strings.welcome.feedback.desc} <@${client.user.id} \`feedback\``. true)
                e.addField(`${strings.welcome.unbind.title}`, `${strings.welcome.unbind.desc} <@${client.user.id}> \`unbind\``, true)
            }
            
            e.addField(`${strings.welcome.settings.title}`, `${strings.welcome.settings.desc} <@${client.user.id}> \`toggle\``, true)
            e.addField(`${strings.welcome.find.title}`, `${strings.welcome.find.title} <@${client.user.id}> \`findchannel\``, true)
        } else {
            e.addField(`${strings.welcome.getting_started_dm.title}`,  `${strings.welcome.getting_started_dm.desc} <@${client.user.id}>`, true)
        }
        e.addField(`${strings.welcome.privacy.title}`, `${strings.welcome.privacy.desc} \`(\` <@${client.user.id}> \`privacy\` \`)\``, true)
        e.addField(`${strings.welcome.ignore.title}`, `${strings.welcome.ignore.desc} \`<!>\``, true)
        e.addField(`${strings.welcome.credits.title}`, `${strings.welcome.credits.desc} <@${client.user.id}> \`credits\``, true)
        if (channel.type == "text" && client.channels.exists(channel => channel.id === dat.id)) {
            e.addField('Bound Channel', `<#${dat.id}>`, true)
        } 
        e.addField('Website', `[CleverBot Website](${strings.links.cleverbot})`, true)
        e.addField('Invite', `[CleverBot Invite](${strings.links.invite.bot.cleverbot})`, true)
        e.addField('Support Server', `[CleverBot Support Server](${strings.links.invite.discord.cleverbot})`, true)
        e.addField('Discord Bot List', `[CleverBot DBL](${strings.links.listings.dbl})`, true)
        e.addField('Bots on Discord Listing', `[CleverBot BOD Listing](${strings.links.listings.bod})`, true)
        e.addField('Discord Bots Listing', `[CleverBot DB Listing](${strings.links.listings.db})`, true)
        e.addField('Discord Bot Hub Listing', `[CleverBot DBH Listing](${strings.links.listings.dbh})`, true)
        e.setFooter('CleverBot v' + config.version)
        return e;
    },
    greeting :function(client, gc) {
        delete require.cache[require.resolve('../strings/main.json')]
        var strings = require('../strings/main.json')

        var e = new Discord.RichEmbed()
        .setColor(config.color)
        .setTitle('CleverBot, a simple AI Chat Bot for Discord')
        .setDescription('Thanks for inviting me to your Discord Server. I span ' + gc + ' servers, and am growing every single day.\n\n**Getting Started**\nTo get started use the bind command `(` <@' + client.user.id + '> `bind #channel` `)` to bind me to a channel. After that you can start chatting with me in the specific channel. You can use the command again if you ever wish to change channels.\n\n' +
            '**About CleverBot Privacy**\nIf you have any privacy concerns you can read over my privacy `(` <@' + client.user.id + '> `privacy` `)`.\n\n' +
            '**Feedback**\nSend any complaints, suggestions, or give a pat on the back to the developer `(` <@' + client.user.id + '> `feedback` `)`.')
        .addField('Website', `[CleverBot Website](${strings.links.cleverbot})`, true)
        .addField('Invite', `[CleverBot Invite](${strings.links.invite.bot.cleverbot})`, true)
        .addField('Support Server', `[CleverBot Support Server](${strings.links.invite.discord.cleverbot})`, true)
        .addField('Developer Website', `[Developer Website](${strings.links.website})`, true)
        .setAuthor(client.user.username, client.user.displayAvatarURL)
        return e;
    },
    feedback: function(supportData, client, msg) {
        var e = new Discord.RichEmbed()
            .setColor(config.color)
            .setTitle("Feedback")
            .setDescription(`Some feedback has come in from ${supportData.authorTag}`)
            .addField('Message', supportData.message)
            .addField('Author Tag', msg.author.tag)
            .addField('Author ID', msg.author.id)
        if(msg.channel.type == "text") {
            e.setDescription(`Some feedback has come in from ${supportData.authorTag} on ${msg.guild.name}`)
            e.addField('Guild Name', msg.guild.name)
            e.addField('Guild ID', msg.guild.id)
        }
        client.users.get("270375857384587264").send({embed: e})
        return;
    },
    lckdwn: function(client) {
        var e = new Discord.RichEmbed()
         .setColor(config.color)
         .setTitle('Lockdown')
         .setDescription(`<@${client.user.id}> \`lockdown enable\` - Begin full lockdown\n<@${client.user.id}> \`lockdown disable\` - End lockdown`)
         .setAuthor(client.user.username, client.user.displayAvatarURL)
         return e;
    },
    lockDownOn: function(lckMsg) {
        delete require.cache[require.resolve('../strings/main.json')]
        var strings = require('../strings/main.json')

        var e = new Discord.RichEmbed()
            .setColor(config.color)
            .setTitle(strings.lockdown.title)
        
        if(lckMsg) {
            e.setDescription(strings.lockdown.desc + lckMsg)
        } else {
            e.setDescription(strings.lockdown.noMsgProvided)
        }
        return e;
    },
    maintenance: function(a) {

        var e = {
            title: a.maintenance.title,
            description: a.maintenance.notice
        }
        return e;
    },
    support: function(a) {

        var e = {
           
            title: a.patreon.title,
            description: a.patreon.desc,
            url: a.patreon.url
        }
        return e;
    }
};