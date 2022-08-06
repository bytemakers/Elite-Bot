const { SlashCommandBuilder, } = require('@discordjs/builders'); 


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
        interaction.reply({ content: 'Example' });
    }
    
}