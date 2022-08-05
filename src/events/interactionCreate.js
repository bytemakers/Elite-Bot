const { InteractionType } = require("discord.js");
module.exports = { 
    name: 'interactionCreate',
    once: false,

    async execute(interaction) {
        
        
        // takes care of slash commands 

        if(interaction.type === InteractionType.ApplicationCommand) {
            const command = interaction.client.commands.get(interaction.commandName);

	        if (!command) return;

	        try {
		        await command.execute(interaction);
	        } catch (error) {
		        console.error(error);
		        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	        }

            return; 
        }

    } 
}


