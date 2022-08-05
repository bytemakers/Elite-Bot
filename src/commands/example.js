const { SlashCommandBuilder, } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits} = require('discord.js'); 


module.exports = {
    data: new SlashCommandBuilder()
        // this name must be lowercase and match the name of the file (without the .js)
        .setName('example')
        .setDescription('example description')
        .addStringOption(option =>  
            option.setName('reason') 
            .setDescription('reason for ban')
        ), 

    async execute(interaction) {
        //execute the command here
    }
    
}