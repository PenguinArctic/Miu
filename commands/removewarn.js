var warns = require("../../data/warns.json");
var util = require('../../akira/utilities.js');
var {MessageEmbed} = require("discord.js");

module.exports = {
    desc:"This is a description",
    async execute(client, message, param){
        if(!message.mentions.users.size) return message.channel.send('No user was mentioned')
        var issued = message.mentions.members.first()
        if(!warns[issued.id]) warns[issued.id] = []

        var number = parseInt(param[2]);
        if(number > warns[issued.id].length || number<1) return message.channel.send(`Warn #${param[2]} not found`);

        var warn = warns[issued.id][number-1];
        warns[issued.id].splice(number-1, 1);

        var embed = new MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setDescription(`${message.author} removed warn #${number} from ${issued}\nOriginal warn: ${warn.reason}`)
            .setTimestamp();

        await message.guild.channels.find('name','staff-log').send(embed)
        await message.channel.send(`${message.author} removed warn #${number} from ${issued}\nOriginal warn: ${warn.reason}`)
        await util.save(warns,'warns')
        message.delete()
    }
}