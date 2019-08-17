const Discord = require('discord.js');
const RichEmbed = require('discord.js').RichEmbed;
var config = require('../../config.json')

// Embed Utility Created by Skylar "TheHacker" McCauley; for use with Discord Bots

module.exports = {
    basicEmbed: function (title, description, color) {
        try {
            var ebd = new Discord.RichEmbed()
                .setColor(color)
                .setTitle(title)
                .setDescription(description)
            return ebd
        } catch(ex) {
            var exbd = new Discord.RichEmbed()
                .setColor(color)
                .setTitle("An Error Has Occurred")
                .setDescription(ex)
            return exbd
        }
    },
    basicAuthorEmbed: function (title, description, authorName, authorImage, color) {
        try {
            var ebd = new Discord.RichEmbed()
                .setColor(color)
                .setAuthor(authorName, authorImage)
                .setTitle(title)
                .setDescription(description)
            return ebd
        } catch(ex) {
            var exbd = new Discord.RichEmbed()
                .setColor(color)
                .setTitle("An Error Has Occurred")
                .setDescription(ex)
            return exbd
        }
    },
    basicFooterEmbed: function (title, description, footer, color) {
        try {
            var ebd = new Discord.RichEmbed()
                .setColor(color)
                .setTitle(title)
                .setDescription(description)
                .setFooter(footer)
            return ebd;
        } catch (ex) {
            var exbd = new Discord.RichEmbed()
                .setColor(color)
                .setTitle("An Error Has Occurred")
                .setDescription(ex)
            return exbd
        }
    },
    basicFooterAuthorEmbed: function (title, description, authorName, authorImage, footer, color) {
        try {
            var ebd = new Discord.RichEmbed()
                .setColor(color)
                .setTitle(title)
                .setAuthor(authorName, authorImage)
                .setDescription(description)
                .setFooter(footer)
                return ebd;
        } catch(ex) {
            var exbd = new Discord.RichEmbed()  
                .setColor(color)
                .setTitle("An Error Has Occurred")
                .setDescription(ex)
                return exbd;
        }
    },

    advancedFooterAuthorFieldEmbed: function (title, description, authorName, authorImage, footer, field1, field2, field3, color) {
        try {
            var ebd = new Discord.RichEmbed()
                .setColor(color)
                .setTitle(title)
                .setAuthor(authorName, authorImage)
                .setDescription(description)
                .setFooter(footer)
                return ebd;
        } catch (ex) {
            var exbd = new Discord.RichEmbed()
                .setColor(color)
                .setTitle("An Error Has Occurred")
                .setDescription(ex)
                return exbd;
        }
    }
  };