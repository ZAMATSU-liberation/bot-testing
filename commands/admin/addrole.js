const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'addrole',
    description: 'adds role to the member mentioned',

    async execute(message, args) {

        await message.channel.sendTyping();
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Get target MEMBER, not User
        const member = message.mentions.members.first();

        if (!member) {
            return message.reply('missing target user');
        }

        // Check moderator permission
        if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return message.reply('missing required perms');
        }

        // Get mentioned role
        const role =
            message.mentions.roles.first() ||
            message.guild.roles.cache.get(args[1]);

        if (!role) {
            return message.reply('mention a role');
        }

        // Check role hierarchy
        if (role.position >= message.guild.members.me.roles.highest.position) {
            return message.reply('role hierarchy is higher');
        }

        // Check if member already has role
        if (member.roles.cache.has(role.id)) {
            return message.reply('member already has this role');
        }

        try {

            // ADD ROLE TO MEMBER
            await member.roles.add(role);

            const embed = new EmbedBuilder()
                .setTitle(`${role.name} assigned to ${member.user.username}`)
                .setColor("#4f0808")
                .setFooter({
                    text: `${message.author.username}`,
                    iconURL: message.author.displayAvatarURL({
                        dynamic: true
                    })
                });

            await message.channel.send({
                embeds: [embed]
            });

        } catch (error) {
            console.error(error);

            await message.channel.send(
                'I couldn\'t add the role to this member.'
            );
        }
    }
};