const Discord = require("discord.js");

const client = new Discord.Client({
    autoReconnect: true
});
const fs = require('fs')
const fse = require('fs-extra')
const package = require('../../package.json')
const config = require('../config.json')


client.on("message", (message) => {
    if(!message.channel.type == 'dm') {
                        if (!fs.existsSync(`./data/serverdata/${message.guild.id}`)) {
                            fs.mkdirSync(`./data/serverdata/${message.guild.id}`)
                        }
                        if (!fs.existsSync(`./data/logs`)) {
                            fs.mkdirSync(`./data/logs`)
                        }
                        if (!fs.existsSync(`./data/logs/${message.guild.id}`)) {
                            fs.mkdirSync(`./data/logs/${message.guild.id}`)
                        }
                        if (!fs.existsSync(`./data/logs/${message.guild.id}/${message.channel.id}`)) {
                            fs.mkdirSync(`./data/logs/${message.guild.id}/${message.channel.id}`)
                        }
                        if (!fs.existsSync(`./data/logs/${message.guild.id}/${message.channel.id}/${message.author.id}`)) {
                            fs.mkdirSync(`./data/logs/${message.guild.id}/${message.channel.id}/${message.author.id}`)
                        }
                        if (!fs.existsSync(`./data/serverdata/${message.guild.id}/channel.txt`)) {
                            fs.writeFileSync(`./data/serverdata/${message.guild.id}/channel.txt`, 'null', function (err) {
                                message.channel.send('An unexpected error occured: ' + err)
                            })
                        }
                } else {
                    if (!fs.existsSync(`./data/logs`)) {
                    fs.mkdirSync(`./data/logs`)
                }
                if (!fs.existsSync(`./data/logs/dm`)) {
                    fs.mkdirSync(`./data/logs/dm`)
                }
                if (!fs.existsSync(`./data/logs/dm/${message.channel.id}`)) {
                    fs.mkdirSync(`./data/logs/dm/${message.channel.id}`)
                }
                if (!fs.existsSync(`./data/logs/dm/${message.channel.id}/${message.author.id}`)) {
                    fs.mkdirSync(`./data/logs/dm/${message.channel.id}/${message.author.id}`)
                }
                }
    
})