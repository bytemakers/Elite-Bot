const fs = require("fs")
const { Routes } = require('discord.js')
const { REST } = require('@discordjs/rest');
const { token, appID, guildID } = require('./config.json');

const commands = [];
const commandFiles = fs.readdirSync(__dirname + '/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(appID, guildID), { body: commands })
	.then(() => console.log(`\x1b[32m${commands.length} commands have been added to the guild. \x1b[0m \n\x1b[33mStarting the bot... \x1b[0m`))   
	.catch(console.error);