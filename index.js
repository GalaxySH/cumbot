// This line MUST be first, for discord.js to read the process envs!
require('dotenv').config();
const xlg = require("./xlogger");
process.on('uncaughtException', function (e) {
    xlg.log(e);
    process.exit(1);
});
/* https://pm2.keymetrics.io/docs/usage/signals-clean-restart/ while looking at pm2-api docs
process.on('SIGINT', function () {
});*/
// catches unhandled promise rejections
process.on('unhandledRejection', async (reason, promise) => {
    var error = new Error('Unhandled Rejection. Reason: ' + reason);
    console.error(error, "Promise:", promise);
});
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json"); // Loading app config file
const xpcooldowns = new Discord.Collection();


client.on("ready", async () => {
    xlg.log(`Bot ${client.user.tag}(${client.user.id}) has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);

    client.user.setPresence({ activity: { name: 'would you give me oral pleasure', type: "PLAYING" }, status: "online" }).catch(console.error);

    //Generates invite link to put in console.
    try {
        let link = await client.generateInvite(2147483639);
        console.log(link);
    } catch (e) {
        xlg.error(e);
    }
});

client.on("rateLimit", rateLimitInfo => {
    xlg.log('Ratelimited: ' + JSON.stringify(rateLimitInfo));
})

client.on("message", async (message) => {
    if (message.author.bot) return;
    if (message.system) return;

    var dm = false; // checks if it's from a dm
    if (!message.guild)
        dm = true;

    let special_prefix = false;
    if (!dm) {
        special_prefix = "!";
    } else {
        special_prefix = "!";
    }
    message.gprefix = special_prefix || config.prefix;
    
    if (message.content.toLowerCase().indexOf(message.gprefix) !== 0) return;
    const args = message.content.slice(message.gprefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();

    try {
        if (commandName == "cum") {
            return message.channel.send("<a:679425331559530496:765738472447016992>");
        }
        if (commandName == "cumhard") {
            return message.channel.send("<a:494858203826225162:765738358307160105>");
        }
    } catch (error) {
        xlg.error(error);
        message.reply('error while executing!');
    }
});

client.login(process.env.TOKEN).catch(console.error);


