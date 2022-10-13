const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField, CommandInteraction } = require("discord.js");
const ShortUniqueId = require("short-unique-id");
const { addWarning, getWarning, removeWarning } = require("../../data/db");
const uniqueId = new ShortUniqueId();

module.exports = {
  helpinfo: "This comand is used to warn people aswell as to see a list of warnings",
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a user or see a list of warnings")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("warn")
        .setDescription("warn a user")
        .addUserOption((option) =>
          option.setName("user").setDescription("user to mute").setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("reason for warning")
            .setMaxLength(150)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("see a list of warnings")
        .addUserOption((option) =>
          option.setName("user").setDescription("user to see warnings for").setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("remove a warning")
        .addUserOption((option) =>
          option.setName("user").setDescription("user to remove warning from").setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("id").setDescription("ID of the warning to remove").setRequired(true)
        )
    ),
  /**
   * @param {CommandInteraction} interaction
   * @return
   */
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const member = interaction.guild.members.cache.get(interaction.options.getUser("user").id);

    const moderator = interaction.guild.members.cache.get(interaction.user.id);

    // Checks before mute or unmute
    if (!member) {
      return interaction.reply({
        content: "User is not in the guild",
        ephemeral: true,
      });
    }

    // makes sure the user has the kick permission
    if (!moderator.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return interaction.reply({
        content: "You do not have permission to mute/unmute members!",
        ephemeral: true,
      });
    }

    // makes sure the user is not the bot
    if (member.user.bot) {
      return interaction.reply({
        content: "You cannot warn a bot!",
        ephemeral: true,
      });
    }

    // makes sure the user is not admin
    if (member === moderator) {
      return interaction.reply({
        content: "You cannot do this to yourself!",
        ephemeral: true,
      });
    }

    // IMPORTANT THIS IS WHERE THE WARN COMMAND IS HANDLED
    await interaction.deferReply(); //prevents timeout
    if (subcommand === "warn") {
      const reason = interaction.options.getString("reason");
      let ID = uniqueId();
      //adding the warning to db
      addWarning({
        userid: member.id,
        guildid: interaction.guild.id,
        modid: moderator.user.id,
        reason: reason,
        warningid: ID,
      });
      return interaction.editReply({
        content: `${moderator} warned ${member.user.tag} for ${reason} with ID: ${ID}`,
      });
    } else if (subcommand === "list") {
      let res = await getWarning(member.id);

      //check if user has a valid record in db
      if (
        res == null ||
        !(interaction.guild.id in res.guilds) ||
        Object.keys(res.guilds[interaction.guild.id]).length == 0
      ) {
        return interaction.editReply("No warnings found!");
      }

      let warnings = res.guilds[interaction.guild.id]; //user warnings
      var warningFields = [];
      for (id in warnings) {
        let date = new Date(warnings[id].time);
        warningFields.push({
          id: id,
          moderator: `${
            interaction.guild.members.cache.get(warnings[id].mod)?.user?.tag ?? "unknown"
          }`,
          reason: warnings[id].reason,
          date: `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`,
        });
      }
      warningFields = warningFields.slice(0, 25); // only showing top 25 because discord limitation
      const ResponseEmbed = new EmbedBuilder()
        .setTitle("Warnings for " + member.user.tag)
        .addFields(
          warningFields.map((warning) => {
            return {
              name: `${warning.moderator} - ${warning.id}`,
              value: `${warning.reason}\n${warning.date}`,
            };
          })
        )
        .setColor("#ff0000")
        .setTimestamp();

      return interaction.editReply({
        embeds: [ResponseEmbed],
      });
    } else if (subcommand === "remove") {
      const ID = interaction.options.getString("id");
      var res = await removeWarning({
        userid: member.user.id,
        warningid: ID,
        guildid: interaction.guild.id,
      });
      if (res)
        return interaction.editReply({
          content: `${moderator} has removed a warning from ${member.user.tag}`,
        });
      return interaction.editReply({
        content: `Something went wrong couldn't remove warning`,
      });
    }
  },
};
