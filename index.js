//Imports and Dependencies
const Discord = require ('discord.js');
var config = require ('./config.json')
const modules = ['Admin', 'Fun', 'General', 'Moderation', 'Owner', 'Economy']
let bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();
const debug_enabled = true;
const AntiSpam = require('discord-anti-spam');
const antiSpam = new AntiSpam({
    warnThreshold: 5,
    kickThreshold: 7,
    banThreshold: 10,
    maxInterval: 2000,
    maxDuplicatesInterval: 2000,
    warnMessage: '{@user}, Please stop spamming.',
    kickMessage: '**{user_tag}** has been kicked for spamming.',
    banMessage: '**{user_tag}** has been banned for spamming.',
    errorMessages: true,
    kickErrorMessage: "Could not kick **{user_tag}** because of improper permissions.",
    banErrorMessage: "Could not ban **{user_tag}** because of improper permissions.",
    maxDuplicatesWarning: 7,
    maxDuplicatesKick: 8,
    maxDuplicatesBan: 10,
    deleteMessagesAfterBanForPastDays: 1,
    exemptPermissions: ["ADMINISTRATOR"],
    ignoreBots: true,
    verbose: false,
    debug: false,
    ignoredUsers: [],
    ignoredRoles: [],
    ignoredGuilds: [],
    ignoredChannels: [],
    warnEnabled: true,
    kickEnabled: true,
    banEnabled: true
});

//CMD Handler
const fs = require('fs'); // Require fs to go throw all folder and files​
modules.forEach(c => {
    fs.readdir(`./Commands/${c}/`, (err, files) => { // Here we go through all folders (modules)
        if (err) throw err; // If there is error, throw an error in the console
        console.log(`<Command Logs> Loaded ${files.length} commands of module ${c}`); // When commands of a module are successfully loaded, you can see it in the console
        files.forEach(f => { // Now we go through all files of a folder (module)
            const props = require(`./Commands/${c}/${f}`); // Location of the current command file
            bot.commands.set(props.help.name, props); // Now we add the command in the bot.commands Collection which we defined in previous code
        });
    })
});

//Debuggers
exports.log = (message) => { log(message); };

exports.debug = (message) => { debug(message); };

function log(message) { console.log("<Bot Core> " + message); }

function debug(message) { if(debug_enabled){ console.log("<Bot Core> " + message); } }

//Listeners
    bot.on('guildMemberAdd', async(member) => {
         await require("./listeners/welcomeEVENT").call(bot, member);
     });
    
     bot.on('guildMemberRemove', async(member) => {
         await require("./listeners/leaveEVENT").call(bot, member);
     });

//Ready
bot.on('ready', () => {
    log("Bot is online");
    bot.user.setActivity(
        `use ${config.prefix}help`
    );
});

//Message
bot.on('message', async(message) => {
    if(config.AllowSpam === false) {
    antiSpam.message(message)
    }
    if (config.ProfanityAllowed === false) {
        let bad_words = ["fuck", "bitch", "whore", "motherfucker", "fucking", "fuc", "dafuq", "dafuck", "fuccing", "fuqing", "motherfucka"];
        for (i = 0; i < bad_words.length; i++) {
            if (message.content.toLowerCase().includes(bad_words[i])) {
                message.delete()
                return message.reply(`Profanity is prohibited in **${message.guild.name}**`).then((message) => {
                    message.delete({timeout: 2500, reason: "Profanity"})
                });

            }
        }
    }
}

    //CMD Handler
    let messageArray = message.content.split(" ")
    let cmd = messageArray[0]
    let args = messageArray.slice(1)

    if(message.content.startsWith(config.prefix)) {
        let commandfile = bot.commands.get(cmd.slice(config.prefix.length))
        if(!commandfile) return message.reply(`${message.content} isn't a command`)
        if(commandfile) {
            await commandfile.run(bot, message, args)
        }
    }
});

//Login
bot.login(config.token)
