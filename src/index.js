const { Client, GatewayIntentBits } = require("discord.js");
const config = require("./config.json"); 

const client = new Client({ 
    intents : [ 
        GatewayIntentBits.Guilds
    ]
});


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});


client.login(config.token);