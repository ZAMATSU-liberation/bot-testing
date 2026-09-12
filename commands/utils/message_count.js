const {EmbedBuilder, PermissionFlagsBits, Embed} = require('discord.js');
module.exports = {
    name : 'm',
    description : 'track and read the total messages of target user',
    // callback function
    async execute(message,args){
        const member = message.mentions.users.first();
        if(!message.member.permissions.has(PermissionFlagsBits.SendMessages)){
            return message.reply('missing permissions..');
        }
        try{
            const total_messages = member.totalMessages;
            
            const embed = new EmbedBuilder()
                .setTitle(`${member.globalName}'s Total messages`)
                .setDescription(`Total messages in server ${total_messages}`)
                .setColor("#bb12e6")
                .setFooter({
                    text : 'messages are bieng updated..'
                });

                await message.channel.send({
                    embeds : [embed]
                });
            }catch{
                message.reply('error fetching user message count');
            }

    }
}