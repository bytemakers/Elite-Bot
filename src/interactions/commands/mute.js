const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField, CommandInteraction } = require("discord.js");
const { errorSoft, success } = require('../embeds')
module.exports = {
  helpinfo: "This comand is used to mute/unmute a user",
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("mute/unmute a user")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("mute a user for 28 days")
        .addUserOption((option) =>
          option.setName("user").setDescription("user to mute").setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("unmute a user")
        .addUserOption((option) =>
          option.setName("user").setDescription("user to unmute").setRequired(true)
        )
    ),
  /**
   *
   * @param {CommandInteraction} interaction
   * @returns
   */
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const member = interaction.guild.members.cache.get(interaction.options.getUser("user").id);
    const moderator = interaction.guild.members.cache.get(interaction.user.id);

    // Checks before mute or unmute
    if (!member) {
      return errorSoft(interaction, "User is not in the guild");
    }

    // makes sure the user has the kick permission
    if (!moderator.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
      return errorSoft(interaction, "You do not have permission to mute/unmute members!");
    }

    // makes sure the user is not the bot
    if (member.user.bot) {
      return errorSoft(interaction, "You cannot mute/unmute a bot!");
    }

    // makes sure the user is not admin
    if (member === moderator) {
      return errorSoft(interaction, "You cannot mute/unmute yourself!");
    }

    if (!member.manageable || !member.moderatable) {
      return errorSoft(interaction, "I cannot mute/unmute this user");
    }
    console.log("passed all checks");

    // mute/unmute the user
    if (subcommand === "add") {
      member.timeout(1000 * 60 * 60 * 24 * 28)//28 days
      success(interaction, "Muted", `${member} has been muted for 28 days!`)
    } else if (subcommand === "remove") {
      member.timeout(null)
      success(interaction, "Unmuted", `${member} has been unmuted!`)
    }
  },
};
