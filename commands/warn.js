var warns = require("../../data/warns.json");
var util = require('../../akira/utilities.js');

module.exports = {
    desc:"This is a description",
    async execute(client, message, param){
        if(!message.mentions.users.size) return message.channel.send('No user was mentioned')
        var issued = message.mentions.members.first()
        if(!warns[issued.id]) warns[issued.id] = []

        var warn = {'reason':'Not defined','issuer':message.author.id}
        if(param.length>2) warn.reason = param.slice(2,param.length).join(' ')
        warns[issued.id].push(warn)

        await message.guild.channels.find('name','staff-log').send(`${message.author} issued warn #${warns[issued.id].length} to ${issued}\nReason: ${warn.reason}`)
        await message.channel.send(`${message.author} issued warn #${warns[issued.id].length} to ${issued}\nReason: ${warn.reason}`)
        if(warns[issued.id].length >= 3){
            issued.ban({ reason: warn.reason })
        } 
        await util.save(warns,'warns')
        message.delete()
    }
}