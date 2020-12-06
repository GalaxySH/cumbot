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
const timeUnits = { second: 1000, minute: 0, hour: 0, day: 0, normalMonth: 0 };
timeUnits.minute = timeUnits.second * 60;
timeUnits.hour = timeUnits.minute * 60;
timeUnits.day = timeUnits.hour * 24;
timeUnits.normalMonth = timeUnits.day * 30;

/**
 * calculates and returns an object of time units that represent the distributed value of the provided duration
 * @param {number} msAlive duration in milliseconds
 * @param {boolean} leadingzero whether times should have leading zeroes
 */
function getFriendlyUptime(msAlive = 0, leadingzero = false) {
    msAlive = Math.abs(msAlive);
    let days = Math.floor(msAlive / timeUnits.day);
    let hours = Math.floor(msAlive / timeUnits.hour) % 24;
    let minutes = Math.floor(msAlive / timeUnits.minute) % 60;
    let seconds = Math.floor(msAlive / timeUnits.second) % 60;
    const milliseconds = msAlive % 1000;
    if (leadingzero) {
        if (days < 10) {
            days = "00" + days;
        } else if (days < 100) {
            days = "0" + days;
        }
        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
    }
    return {
        days,
        hours,
        minutes,
        seconds,
        milliseconds
    };
}

client.on("ready", async () => {
    xlg.log(`Bot ${client.user.tag}(${client.user.id}) has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);

    // set the visible bot status
    setInterval(async () => {
        // would you give me oral pleasure
        client.user.setPresence({ activity: { name: `█▀█ █▄█ ▀█▀\n${config.prefix}help`, type: "PLAYING" }, status: "online" }).catch(console.error);
    }, 20000);

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
    try {
        if (message.author.bot) return;
        if (message.system) return;

        var dm = false; // checks if it's from a dm
        if (!message.guild)
            dm = true;

        let special_prefix = false;
        /*if (!dm) {
            special_prefix = "!";
        } else {
            special_prefix = "!";
        }*/
        message.gprefix = special_prefix || config.prefix;
        
        if (message.content.toLowerCase().indexOf(message.gprefix) !== 0) return;
        const args = message.content.slice(message.gprefix.length).trim().split(/ +/g);
        const commandName = args.shift().toLowerCase();

        if (commandName === "cum") {
            return message.channel.send("<a:679425331559530496:765738472447016992>");
        }
        if (commandName === "cumhard") {
            return message.channel.send("<a:494858203826225162:765738358307160105>");
        }
        if (commandName === "help") {
            message.channel.send(`Thank you for letting me be a part of your server.
Use these commands to access my features:
${message.gprefix}help
${message.gprefix}cum
${message.gprefix}cumhard
${message.gprefix}invite`)
            return;
        }
        if (commandName === "invite") {
            const inv = await client.generateInvite(604310592);
            message.channel.send({
                embed: {
                    description: `[invite me](${inv})`
                }
            });
            return;
        }
        if (commandName === "uptime") {
            const uptime = getFriendlyUptime(client.uptime || 0, true);
            message.channel.send({
                embed: {
                    title: "Bot Lifetime",
                    description: 'How long the bot has been alive',
                    fields: [{
                            name: "Elapsed Time",
                            value: `\`${uptime.days} : ${uptime.hours} : ${uptime.minutes} ; ${uptime.seconds} . ${uptime.milliseconds}\ndays  hrs  min  sec  ms \``,
                            inline: true
                        },
                        {
                            name: "Started At",
                            value: new Date(client.readyTimestamp || "").toUTCString()
                        }
                    ]
                }
            });
            return;
        }
        if (commandName === "eval" && message.author.id === "142831008901890048") {
            try {
                let evalRet = await eval(`(async () => {${args.join(" ")}})()`);
                message.channel.send(`🟢 Executed:\n\`\`\`${evalRet ? evalRet : 'no return'}\`\`\``, {
                    split: true
                });
                xlg.log("Executed `eval`: success");
            } catch (e) {
                //xlg.log(`EM: ${e.message} EStack: ${e.stack}`);
                xlg.log("Executed `eval`: fail");
                message.channel.send(`🔴 Execution Error:\n\`\`\`${e}\`\`\``);
            }
        }
    } catch (error) {
        xlg.error(error);
        message.reply('error while executing!');
    }
});

client.login(process.env.TOKEN).catch(console.error);


