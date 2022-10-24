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
        .setDescription("mute a user")
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

    if (!member.manageable) {
      return errorSoft(interaction, "I cannot mute/unmute this user");
    }

    //check if the server has a mute role
    const muteRole = interaction.guild.roles.cache.find((role) => role.name === "Muted");
    if (!muteRole) {
      return errorSoft(interaction, `This server does not have a "Muted" role, plesae create one and rerun this command.`);
      //todo, create the role automatically and create overrides on channels/categpries to make it actually functional
    }

    console.log("passed all checks");

    // mute/unmute the user
    if (subcommand === "add") {
      member.roles.add(muteRole.id);
      success(interaction, `${member} has been muted`)
    } else if (subcommand === "remove") {
      member.roles.remove(muteRole);
      success(interaction, `${member} has been unmuted`)
    }
  },
};
