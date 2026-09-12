/*const {EmbedBuilder} = require('discord.js');

module.exports = {
    name : 'marriage',
    description : 'propose marriage to another user',
    async execute(message,args){
        const member = message.mentions.users.first();
        if (!member) return message.reply('```missing target user to propose```');
        if(member.id === message.author.id){
            return message.channel.send({text : 'you cant marry yourself'});
        }
        if(message.bot){
            return message.reply('Nigga you cant marry a bot');
        }
        const embed = new EmbedBuilder()
            .setTitle(`${message.author.globalName} proposes ${member.globalName} do you accept \n ${member.globalName} ?? `)
            .setColor("Random")
            .setFooter({
                text : `React with 💚 to accept or💔 to decline `
            });
        const proposal = await message.channel.send({embeds : [embed]});

        await proposal.react('💔');
        await proposal.react('💚');
        const filter = (reaction,user)=>
            ['💔','💚'].includes(reaction.emoji.name) && 
            user.id === member.id;
        // filter the react use by user

        const collection = proposal.createReactionCollector({
            filter,
            max : 1,
            time : 60_000
        });

        collection.on('collect', async(reaction)=>{

        })
        
    }    
} */