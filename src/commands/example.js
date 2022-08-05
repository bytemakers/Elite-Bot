const { SlashCommandBuilder, } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits} = require('discord.js'); 


module.exports = {
    data: new SlashCommandBuilder()
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