const { SlashCommandBuilder } = require('@discordjs/builders'); 
const { EmbedBuilder, PermissionsBitField, CommandInteraction} = require('discord.js');


module.exports = { 
    helpinfo : "This comand is used to mute/unmute a user",
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('mute/unmute a user')
        .addSubcommand(subcommand => subcommand
            .setName('mute')
            .setDescription('mute a user')
            .addUserOption(option =>
                option.setName('user')
                .setDescription('user to mute')
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('unmute')
            .setDescription('unmute a user')
            .addUserOption(option =>
                option.setName('user')
                .setDescription('user to unmute')
                .setRequired(true)
            )
        ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @returns 
     */
    async execute(interaction) { 
        const subcommand = interaction.options.getSubcommand();
        const member = interaction.guild.members.cache.get(interaction.options.getUser('user').id);
        const moderator = interaction.guild.members.cache.get(interaction.user.id);

        // Checks before mute or unmute
        if(!member) {
            return interaction.reply({ content: 'User is not in the guild', ephemeral: true });
        }

        // makes sure the user has the kick permission
        if (!moderator.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
            return interaction.reply({ content: 'You do not have permission to mute/unmute members!', ephemeral: true });
        }

        // makes sure the user is not the bot
        if(member.user.bot) {
            return interaction.reply({ content: 'You cannot mute/unmute a bot!', ephemeral: true });
        }

        // makes sure the user is not admin
        if(member === moderator) {
            return interaction.reply({ content: 'You cannot mute/unmute yourself!', ephemeral: true });
        }
        
        if(!member.manageable) {
            return interaction.reply({ content: `I cannot mute/unmute this user`, ephemeral: true });
        }

        //check if the server has a mute role 
        const muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');
        if(!muteRole) {
            return interaction.reply({ content: `This server does not have a "Muted" role, plesae create one and rerun this command.`, ephemeral: true });
            //todo, create the role automatically and create overrides on channels/categpries to make it actually functional
        } 

        console.log('passed all checks');

        // mute/unmute the user
        if(subcommand === 'mute') {            
            member.roles.add(muteRole.id);
            interaction.reply({ content: `${member} has been muted`, ephemeral: true });
        }
        else if(subcommand === 'unmute') {
            member.roles.remove(muteRole);
            interaction.reply({ content: `${member} has been unmuted`, ephemeral: true });
        }
    }
}

