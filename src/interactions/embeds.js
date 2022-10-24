const { EmbedBuilder } = require('@discordjs/builders')
const { CommandInteraction } = require('discord.js')
const errorImage = "https://i.imgur.com/McAinWv.png"
/**
 * **sends** error embed
 * @param {CommandInteraction} intearction 
 */
module.exports.errorSoft = async (intearction, title, description) => {
    let embed = new EmbedBuilder()
        .setColor(0xFFCC4D)
    if (!intearction) throw ("intearction is a required argument");
    if (title) embed.setTitle("⚠️ " + title)
    if (description) embed.setDescription(description)

    if (!intearction.replied) await intearction.reply({ embeds: [embed], ephemeral: true })
    else await intearction.channel.send({ embeds: [embed], ephemeral: true })
    return;
}
/**
 * **sends** success embed
 * @param {CommandInteraction} intearction 
 */
module.exports.success = async (intearction, title, description) => {
    let embed = new EmbedBuilder()
    .setColor(0x77B255)
    if (!intearction) throw ("intearction is a required argument");
    if (title) embed.setTitle("✅ " + title)
    if (description) embed.setDescription(description)

    if (!intearction.replied) await intearction.reply({ embeds: [embed], ephemeral: true })
    else await intearction.channel.send({ embeds: [embed], ephemeral: true })
    return;
}