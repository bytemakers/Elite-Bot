const fs = require("fs");

const { Client, Collection, Intents } = require('discord.js');
const { keep_alive } = require("./keep_alive");

const JSON5 = require("json5");
const settings = JSON5.parse(process.env.settings);

const { token, prefix, color } = settings.bot;


const client = new Client({
    intents: [
        // necessary intents
    ]
});

client.on("ready", () => {
  console.log(`[!]: The bot is ready, logged in as ${client.user.tag}`);
  client.user.setActivity(`$help`, { type: "LISTENING" })
});

/* <<--------------------------------------------------------------------------------------------------------------------->>
All of the following below have to be rewritten to use the new discord.js library,
which utilizes the new intents system and interactions with the client instead of messages.

I suggest to follow the guide at https://discordjs.guide/ for more information.
<<--------------------------------------------------------------------------------------------------------------------->> */

client.on("message", async message => {
  if (message.channel.type === "dm") return;
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.member) {
    message.member = await message.guild.fetchMember(message);
  }

  if (message.content.match(new RegExp(`^<@!?${client.user.id}>`))) {
    return message.channel.send(`Bot prefix : ${prefix}`);
  }

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(" ");
  const cmd = args.shift().toLowerCase();
  if (cmd.length === 0) return;

  let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));

  if (!command) return;

  if (command) {
    if (!message.guild.me.hasPermission("ADMINISTRATOR"))
      return message.channel.send("I don't have enough permission to use this or any of my commands! | Require: Administrator");
    command.run(client, message, args);
  }
  
  console.log(`User : ${message.author.tag} (${message.author.id}) Server : ${message.guild.name} (${message.guild.id}) Command : ${command.name}`);
});

const modules = ["fun", "info", "moderation"];

modules.forEach((module) => {
  fs.readdir(`./commands/${module}`, (err, files) => {
    if (err)
      return new Error(
        "Missing folder of commands! Example : commands/<folder>/<command>.js"
      );
    files.forEach((file) => {
      if (!file.endsWith(".js")) return;
      let command = require(`./commands/${module}/${file}`);
      console.log(`✅ ${command.name} command has been loaded!`);
      if (command.name) client.commands.set(command.name, command);
      if (command.aliases) {
        command.aliases.forEach(alias =>
          client.aliases.set(alias, command.name)
        );
      }
      if (command.aliases.length === 0) command.aliases = null;
    });
  });
});

client.login(token).catch(err => console.log(err));

/*
  Bot Coded by DVS Tech
  DONOT share WITHOUT credits!!
*/