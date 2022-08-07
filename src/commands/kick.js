const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField} = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('kick a user')
        .addUserOption(option => 
            option.setName('user')
            .setDescription('user to kick')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('reason')
            .setDescription('reason for kick')
            .setMaxLength(400)
        ), 

    async execute(interaction) { 
        const member = interaction.guild.members.cache.get(interaction.options.getUser('user').id);
        const reason = interaction.options.getString('reason');
        const moderator = interaction.guild.members.cache.get(interaction.user.id);


        // makes sure the user is in the guild
        if(!member) {
            return interaction.reply({ content: 'User is not in the guild', ephemeral: true });
        }

        // makes sure the user has the kick permission
        if (!moderator.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return interaction.reply({ content: 'You do not have permission to kick members!', ephemeral: true });
        }

        // makes sure the user is not the bot
        if(member.bot) {
            return interaction.reply({ content: 'You cannot kick a bot!', ephemeral: true });
        }

        // makes sure the user is not admin
        if(member === moderator) {
            return interaction.reply({ content: 'You cannot kick yourself!', ephemeral: true });
        }
        
        if(!member.kickable) {
            return interaction.reply({ content: `I cannot kick this user`, ephemeral: true });
        }





            
        member.kick({ reason: `${moderator} - ${reason || 'No reason provided'}` });


        const kickEmbed = new EmbedBuilder()
            .setTitle('Kicked')
            .setDescription(`${member} has been kicked`)
            .addFields([
                { name: 'Moderator', value: `${moderator}` },
                { name: 'Reason', value: `${reason || 'No reason provided'}` }
            ])
            .setColor('#ffa500')
            .setTimestamp();


        interaction.reply({ embeds: [kickEmbed] });
    }
} 
