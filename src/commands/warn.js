const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField,CommandInteraction} = require("discord.js");

module.exports = {
  helpinfo:
    "This comand is used to warn people aswell as to see a list of warnings",
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a user or see a list of warnings")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("warn")
        .setDescription("warn a user")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("user to mute")
            .setRequired(true)
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
          option
            .setName("user")
            .setDescription("user to see warnings for")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("remove a warning")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("user to remove warning from")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("ID of the warning to remove")
            .setRequired(true)
        )
    ),
  /**
    * @param {CommandInteraction} interaction 
    * @return
    */
  async execute(interaction) {    
    
    const subcommand = interaction.options.getSubcommand();
    const member = interaction.guild.members.cache.get(
      interaction.options.getUser("user").id
    );
    const guild = interaction.guild;
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

    if (subcommand === "warn") {
      const reason = interaction.options.getString("reason");

      /* 
        This is where you need to write the code to interact with the database for when a user is warned

        you can get the targeted user from the `member` variable
        you can get the moderator from the `moderator` variable
        you cant get the reason from the `reason` variable
        you can get the guild from the `guild` variable
      */

      //reply to the slash command with a succesfful message
      interaction.reply({
        content: `${moderator} has warned ${member.user.tag} for ${reason}`,
      });
    } else if (subcommand === "list") {
      /* 
        This is where you need to write the code to interact with the database for when a admin is requesting a list of warnings for a user

        you can get the targeted user from the `member` variable
        you can get the moderator from the `moderator` variable
        you cant get the reason from the `reason` variable
        you can get the guild from the `guild` variable
      */

      const mockWarnings = [
        {
          id: "some random id dosnt matter how it is generated",
          moderator: "Moderator#1234",
          reason: "This is a mock warning",
          date: "2020-01-01",
        },
        {
          id: "some random id dosnt matter how it is generated",
          moderator: "Moderator#1234",
          reason: "This is a mock warning",
          date: "2020-01-02",
        },
      ];

      // use this embed to display the list of warnings
      const ResponseEmbed = new EmbedBuilder()
        .setTitle("Warnings for " + member.user.tag)
        .addFields(
          mockWarnings.map((warning) => {
            return {
              name: `${warning.moderator} - ${warning.id}`,
              value: `${warning.reason}`,
            };
          })
        )
        .setColor("#ff0000")
        .setTimestamp();

      //reply to the slash command with a succesfful message
      interaction.reply({
        embeds: [ResponseEmbed],
      });
    } else if (subcommand === "remove") {
      const ID = interaction.options.getString("ID");

      /*
        This is where you need to write the code to interact with the database for when a admin is removing a warning from a user

        you can get the id of the warning from the `ID` variable
        you can get the targeted user from the `member` variable
        you can get the moderator from the `moderator` variable
        you can get the guild from the `guild` variable

        */

      interaction.reply({
        content: `${moderator} has removed a warning from ${member.user.tag}`,
      });
    }
  },
};
