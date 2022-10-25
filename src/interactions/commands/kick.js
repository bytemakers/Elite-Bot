const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField, CommandInteraction } = require("discord.js");
const { errorSoft } = require('../embeds')
module.exports = {
  helpinfo: "This comand is used to kick a user from the server",
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("kick a user")
    .addUserOption((option) =>
      option.setName("user").setDescription("user to kick").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("reason for kick").setMaxLength(400)
    ),
  /**
   *
   * @param {CommandInteraction} interaction
   * @returns
   */
  async execute(interaction) {
    const member = interaction.guild.members.cache.get(interaction.options.getUser("user").id);
    const reason = interaction.options.getString("reason");
    const moderator = interaction.guild.members.cache.get(interaction.user.id);

    // makes sure the user is in the guild
    if (!member) {
      return errorSoft(interaction, "User is not in the guild")
    }
    // makes sure the user has the kick permission
    if (!moderator.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return errorSoft(interaction, "You do not have permission to kick members!")
    }

    // makes sure the user is not the bot
    if (member.user.bot) {
      return errorSoft(interaction, "You cannot kick a bot!")
    }

    // makes sure the user is not admin
    if (member === moderator) {
      return errorSoft(interaction, "You cannot kick yourself!")
    }

    if (!member.kickable) {
      return errorSoft(interaction, "I cannot kick this user")
    }

    member.kick({ reason: `${moderator} - ${reason || "No reason provided"}` });

    const kickEmbed = new EmbedBuilder()
      .setTitle("Kicked")
      .setDescription(`${member} has been kicked`)
      .addFields([
        { name: "Moderator", value: `${moderator}` },
        { name: "Reason", value: `${reason || "No reason provided"}` },
      ])
      .setColor("#ffa500")
      .setTimestamp();

    interaction.reply({ embeds: [kickEmbed] });
  },
};
