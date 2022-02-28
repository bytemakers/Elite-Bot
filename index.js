// Discord Library
const { Client, Collection } = require('discord.js')
const client = new Client();

// fs ffs!
const fs = require("fs");
const { keep_alive } = require("./keep_alive");

// Parsing Settings
const JSON5 = require('json5');
const settings = JSON5.parse(process.env.settings)

// Secret Vars
const botToken = settings.bot.token;
const botPrefix = settings.bot.prefix;
const embedColor = settings.embeds.color;

// Exporting Secrets
module.exports = {
  token: botToken,
  Prefix: botPrefix,
  Color: embedColor
}

// Collection
client.commands = new Collection();
client.aliases = new Collection();

// On Ready
client.on("ready", () => {
  console.log(`[!]: The Bot is ready, logged in as ${client.user.tag}`);
  client.user.setActivity(`$help`, { type: "LISTENING" })
});

// On Message
client.on("message", async message => {
  if (message.channel.type === "dm") return;
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.member) {
    message.member = await message.guild.fetchMember(message);
  }

  if (message.content.match(new RegExp(`^<@!?${client.user.id}>`))) {
    return message.channel.send(`Bot Prefix : ${Prefix}`);
  }
  const Prefix = botPrefix;
  if (!message.content.startsWith(Prefix)) return;

  const args = message.content
    .slice(Prefix.length)
    .trim()
    .split(" ");
  const cmd = args.shift().toLowerCase();
  if (cmd.length === 0) return;

  let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));

  if (!command) return;
  if (command) {
    if (!message.guild.me.hasPermission("ADMINISTRATOR"))
      return message.channel.send("I Don't Have Enough Permission To Use This Or Any Of My Commands | Require : Administrator");
    command.run(client, message, args);
  }
  console.log(
    `User : ${message.author.tag} (${message.author.id}) Server : ${message.guild.name} (${message.guild.id}) Command : ${command.name}`
  );
});

const modules = ["fun", "info", "moderation"];

modules.forEach((module) => {
  fs.readdir(`./commands/${module}`, (err, files) => {
    if (err)
      return new Error(
        "Missing Folder Of Commands! Example : Commands/<Folder>/<Command>.js"
      );
    files.forEach((file) => {
      if (!file.endsWith(".js")) return;
      let command = require(`./commands/${module}/${file}`);
      console.log(`${command.name} Command Has Been Loaded - ✅`);
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

client.login(botToken).catch((e) => { console.log(`the token is invalid!`) })

/*
  Bot Coded by DVS Tech
  DONOT share WITHOUT credits!!
*/