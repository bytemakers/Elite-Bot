const embed = require('../interactions/embeds')
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isCommand()) {
      const command = client.commands.get(interaction.commandName);

      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        client.Logger.error(`Error executing command ${command.data.name} : \n ${error}`);        
        await embed.errorSoft(interaction, "There was an error while executing this command!")
      }
    } else if (interaction.isButton()) {
      const button = client.buttons.get(interaction.customId);

      if (!button) return;

      try {
        await button.execute(interaction);
      } catch (error) {
        interaction.client.Logger.error(
          `Error executing button ${button.data.customId} : \n ${error}`
        );
        await embed.errorSoft(interaction, "There was an error while executing this button!");
      }
    } else if (interaction.isSelectMenu()) {
      const selectMenu = client.selectMenus.get(interaction.customId);

      if (!selectMenu) return;

      try {
        await selectMenu.execute(interaction);
      } catch (error) {
        interaction.client.Logger.error(
          `Error executing selectMenu ${selectMenu.data.customId} : \n ${error}`
        );
        await embed.errorSoft(interaction, "There was an error while executing this select menu!");
      }
    }
  },
};
