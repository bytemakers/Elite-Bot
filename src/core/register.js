const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const { cwd } = require("node:process");

module.exports = {
  async register(token, guildID, appID, commandsPath, logger) {
    const commands = [];
    const commandFiles = fs
      .readdirSync(path.resolve(cwd(), commandsPath))
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(path.resolve(cwd(), commandsPath, file));
      commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: "10" }).setToken(token);

    (async () => {
      try {
        logger.info(
          `Started refreshing ${commands.length} ${
            guildID ? "guild" : "global"
          } application (/) commands.`
        );

        let data;

        if (guildID) {
          // if guildID is provided, register guild commands
          data = await rest.put(Routes.applicationGuildCommands(appID, guildID), {
            body: commands,
          });
        } else {
          // if guildID is not provided, register global commands
          data = await rest.put(Routes.applicationCommands(appID), {
            body: commands,
          });
        }

        logger.info(
          `Successfully reloaded ${data.length} ${
            guildID ? "guild" : "global"
          } application (/) commands. `
        );
      } catch (error) {
        logger.error(error);
      }
    })();
  },
};
