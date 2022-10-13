/*
  all the magic happens in ./core/client.js 
  this is where the bot starts though
*/

const { GatewayIntentBits } = require("discord.js");
const BotClient = require("./core/client");
const { token, guildID, appID } = require("./config.json");
const client = new BotClient({
  intents: [GatewayIntentBits.Guilds], // this is the only intent you need for slash commands to work

  paths: {
    // this is where you put the paths to your files
    eventPath: "src/events",
    commandsPath: "src/interactions/commands", // this is where you put your slash commands
    buttonsPath: "src/interactions/buttons", // this is for buttons
    selectMenusPath: "src/interactions/selectMenus", // this is for the select menus
    ModalsPath: "src/interactions/modals", // this is for the modal files
  },
  loggerInfo: {
    logPath: "/logs", // this is where the logs will be stored
    logColor: true, // true or false
    logTime: true, // true or false
  },
});

client.build(token, guildID, appID);

module.exports = client;
