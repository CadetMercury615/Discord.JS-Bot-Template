const Discord = require('discord.js');
/**
 * @param {module:"discord.js".Client} beam
 * @param {module:"discord.js".Message} message
 * @param {array} args
 * @return {Promise<void>}
 */

module.exports.run = async(beam, message, args) => {
    console.log("Ping")
    message.reply("pong")
}

module.exports.help = {
    name: "ping"
}
