const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { errorSoft, success } = require('../embeds')
module.exports = {
  helpinfo: "This comand is used to clear a channel of messages (up to 100)",
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("clear a set number of messages")
    .addIntegerOption((option) =>
      option
        .setName("number")
        .setDescription("number of messages to clear")
        .setMaxValue(100)
        .setMinValue(1)
        .setRequired(true)
    ),

  async execute(interaction) {
    const admin = interaction.guild.members.cache.get(interaction.user.id);
    const amount = interaction.options.getInteger("number");
    const channel = interaction.channel;
    if (!admin.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return errorSoft(interaction, "You do not have permission to clear messages!");

    }

    await channel.bulkDelete(amount);
    success(interaction, `Cleared ${amount} messages!`);
  },
};
