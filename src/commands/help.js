const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs'); 


module.exports = {
    helpinfo : "This comand is used to see a list of commands",
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('see a list of commands'), 

    async execute(interaction) {
        //get the helpinfo from each command file
        const commands = fs.readdirSync('../src/commands');
        const commandList = [];
        for(const command of commands) {
            const commandData = require(`./${command}`);
            commandList.push({ 
                name: command.replace('.js', ''),
                description: commandData.helpinfo
            });
        }
        //send the helpinfo to the user
        const embed = new EmbedBuilder()
            .setTitle('Help')
            .setDescription('A list of all commands')
            .addFields(commandList.map(command => ({ name: `${command.name}`, value: `${command.description}` })))
            .setTimestamp();
        
        interaction.reply({ embeds : [embed] });
    }
}

