require('dotenv').config()
const wiki = require('wikijs').default;
const discord = require('discord.js');

const client = new discord.Client();

const token = process.env.token;

function titleCase(str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
}

async function getContent(article) {
    let info = undefined;
    try {
        info = await wiki().page(article).then(page => page.content())
    } catch {
        info = undefined;
    }
    return info;
}
async function getSummary(article) {
    let info = undefined;
    try {
        info = await wiki().page(article).then(page => page.summary())
    } catch {
        info = undefined;
    }
    return info;
}

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}.`);
});

client.on('message', async msg => {
    let prefix = "w.";
    if (msg.content.startsWith(prefix)) {
        let args = msg.content.split(" ");
        let command = args[0].slice(prefix.length, args[0].length);
        args.shift();
        command = command.toLowerCase();
        if (command === "summary") {
            let query = titleCase(args.join(" "));
            let summary = await getSummary(query);

            if (summary) {
                for (let i = 0; i < summary.length; i += 1996) {
                    const toSend = summary.substring(i, Math.min(summary.length, i + 1996));
                    await msg.channel.send("**" + toSend.trim() + "**")
                }
            } else {
                await msg.channel.send("Your query wasn't found.")
            }
        } else if (command === "info") {
            let query = titleCase(args.join(" "));
            let info = await getContent(query);
            if (info) {
                info.forEach(e => {
                    if (e.content != "") {
                        for (let i = 0; i < e.content.length; i += 1998) {
                            const toSend = e.content.substring(i, Math.min(e.content.length, i + 1998));
                            if (i === 0) {
                                msg.channel.send("\n\n**" + e.title + "**" + "\n");
                            }
                            msg.channel.send("*" + toSend.trim() + "*");
                        }
                    }
                });
            } else {
                msg.channel.send("Your query was not found on Wikipedia.");
            }

        }
    }
})

client.login(token)