const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField, CommandInteraction } = require("discord.js");
const { errorSoft } = require("../embeds");

module.exports = {
  helpinfo: "This comand is used to ban a user from the server",
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("ban a user")
    .addUserOption((option) =>
      option.setName("user").setDescription("user to ban").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("reason for ban").setMaxLength(400)
    ),
  /**
   * @param {CommandInteraction} interaction
   * @return
   */
  async execute(interaction) {
    const member = interaction.guild.members.cache.get(interaction.options.getUser("user").id);
    const reason = interaction.options.getString("reason");
    const moderator = interaction.guild.members.cache.get(interaction.user.id);

    // makes sure the user is in the guild
    if (!member) {
      return errorSoft(interaction, "User is not in the guild")
    }

    // makes sure the user has the ban permission
    if (!moderator.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return errorSoft(interaction, "You do not have permission to ban members!")
    }

    // makes sure the user is not the bot
    if (member.user.bot) {
      return errorSoft(interaction, 'You cannot ban a bot!')
    }

    // makes sure the user is not admin
    if (member === moderator) {
      return errorSoft(interaction, "You cannot ban yourself!")      
    }

    if (!member.bannable) {
      return errorSoft(interaction, "I cannot ban this user")
    }

    member.ban({ reason: `${moderator} - ${reason || "No reason provided"}` });

    const banEmbed = new EmbedBuilder()
      .setTitle("Banned")
      .setDescription(`${member} has been banned`)
      .addFields([
        { name: "Moderator", value: `${moderator}` },
        { name: "Reason", value: `${moderator} - ${reason || "No reason provided"}` },
      ])
      .setColor("#ff0000")
      .setTimestamp();

    interaction.reply({ embeds: [banEmbed] });
  },
};
