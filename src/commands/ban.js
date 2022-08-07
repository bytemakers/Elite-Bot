const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField} = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('ban a user')
        .addUserOption(option => 
            option.setName('user')
            .setDescription('user to ban')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('reason')
            .setDescription('reason for ban')
        ), 

    async execute(interaction) { 
        const member = interaction.guild.members.cache.get(interaction.options.getUser('user').id);
        const reason = interaction.options.getString('reason');
        const moderator = interaction.guild.members.cache.get(interaction.user.id);


        if(reason.length > 400) {
            return interaction.reply({ content: 'Reason is too long!', ephemeral: true });
        }

        // makes sure the user is in the guild
        if(!member) {
            return interaction.reply({ content: 'User is not in the guild', ephemeral: true });
        }

        // makes sure the user has the ban permission
        if (!moderator.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: 'You do not have permission to ban members!', ephemeral: true });
        }

        // makes sure the user is not the bot
        if(member.bot) {
            return interaction.reply({ content: 'You cannot ban a bot!', ephemeral: true });
        }

        // makes sure the user is not admin
        if(member === moderator) {
            return interaction.reply({ content: 'You cannot ban yourself!', ephemeral: true });
        }
        
        if(!member.bannable) {
            return interaction.reply({ content: `I cannot ban this user`, ephemeral: true });
        }





            
        member.ban({ reason: `${moderator} - ${reason || 'No reason provided'}` });


        const banEmbed = new EmbedBuilder()
            .setTitle('Banned')
            .setDescription(`${member} has been banned`)
            .addFields([
                { name: 'Moderator', value: `${moderator}` },
                { name: 'Reason', value: `${moderator} - ${reason || 'No reason provided'}` }
            ])
            .setColor('#ff0000')
            .setTimestamp();


        interaction.reply({ embeds: [banEmbed] });
    }
} 
