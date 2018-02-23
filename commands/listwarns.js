var warns = require("../../data/warns.json");
var util = require('../../akira/utilities.js');
var {MessageEmbed} = require("discord.js");

module.exports = {
    desc:"This is a description",
    async execute(client, message, param){
        var issued = message.member;
        if(message.mentions.users.size && message.member.roles.exists("name","Staff Team")) issued = message.mentions.members.first()        
        if(!warns[issued.id]) warns[issued.id] = []

        var warnsMsg = ``;
        for(var i=0;i<warns[issued.id].length;i++){
            warnsMsg += `${i+1}) ${warns[issued.id][i].reason}\n`
        }

        var embed = new MessageEmbed()
            .setColor(issued.displayColor)
            .setDescription(warnsMsg)
            .setTitle("Issued warns")
            .setAuthor(issued.displayName, issued.user.displayAvatarURL());

        message.channel.send(embed)
    }
}