const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField, time } = require("discord.js");
const { version } = require("../../package.json");
const fs = require("fs");
const axios = require("axios");
module.exports = {
  botinfoinfo: "This command is used for getting information about the bot",
  data: new SlashCommandBuilder().setName("botinfo").setDescription("Information about the bot"),

  async execute(interaction) {
    let ping = interaction.client.ws.ping;
    let uptime = interaction.client.uptime;
    // get the time the bot started and limit the length to 9 decimal places
    let started = interaction.client.readyAt;

    //might have to change the link later if you change the repo name or movie it to a org or something
    let data = await axios.get(
      "https://api.github.com/repos/devarshishimpi/Elite-Bot/contributors"
    );

    let contributors = data.data.map((contributor) => {
      return `\n ${contributor.login}`;
    });

    const embed = new EmbedBuilder()
      .setTitle("Bot Information")
      .setDescription("Information about the bot")
      .addFields([
        { name: "Version", value: `${version}`, inline: true },
        { name: "Ping", value: `${ping}ms`, inline: true },
        { name: "Uptime", value: `${time(started, "R")}`, inline: true },
        { name: "Contributors", value: `${contributors}`, inline: true },
      ]);

    interaction.reply({ embeds: [embed] });
  },
};
