const Discord = require('discord.js');
const config = require('./data/config.json')
const fs = require('fs')

const Manager = new Discord.ShardingManager('./index.js', {token: config.token});

/*
	2500 servers -> 2 Shards
	
	0.0008 shards per server
	
	guild_count * 0.0008 = shard_count

*/

var stats = require("./data/cache/stats.json")

	var guildCount = parseInt(stats.guildCount)

var neededShards = Math.round(parseInt(0.0008 * guildCount))
neededShards = parseInt(neededShards)

if(neededShards < 1) {
	neededShards = 1
}
	stats.shardCount = neededShards
fs.writeFile("./data/cache/stats.json", JSON.stringify(stats, null, 2), function(err) {
	if(err) return console.log(err)
})
delete require.cache[require.resolve("./data/cache/stats.json")]
Manager.spawn(neededShards); // This example will spawn 2 shards (5,000 guilds);