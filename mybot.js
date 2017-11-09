const Discord = require("discord.js");
const client = new Discord.Client();

var config = require("../data/dvaconfig.json")
var nicks = require('../data/nicks.json');
var fs = require("fs");
var util = require("../akirabot/utilities.js")

client.on("guildMemberAdd", (member) => {
    var name = member.user.username;
    if(nicks [member.id] == undefined) {
        member.setNickname(util.stripEmoji(name) + " ☕");
        nicks [member.id] = util.stripEmoji(name) + " ☕";
        util.save(nicks,"nicks");
    }else{
        member.setNickname(nicks[member.id],"Locked nickname");
    }
});



client.on('message', message => {
    var prefix = ">";
    if(message.content.startsWith(prefix)){
        var command = {};

        var param = message.content.split(" ");
        param[0] = param[0].split(prefix)[1];

        const commandName = param[0]
        if(util.permCheck(message,commandName)){
            switch(commandName){
                case "panic":
                    message.channel.overwritePermissions(message.guild.roles.get(message.guild.id),{SEND_MESSAGES: false} ,"EVERYBODY PANIC")
                    break;

                case "panicoff":
                    message.channel.overwritePermissions(message.guild.roles.get(message.guild.id),{SEND_MESSAGES: null},"EVERYBODY STOP PANICKING" )
                    break;

                case "warn":
                    if(message.mentions.members.size==1 ) {
             param.shift()
             param.shift()
            var reason = param.join(" ")
                    message.mentions.members.first().send(reason)


}
            }
        }
    }

    switch(message.channel.name){
        case "change-nickname":
            var emoji = message.member.nickname.split(" ").pop();

            var namechange = message.content + " " + emoji;
            nicks[message.member.id] = namechange;

            message.member.setNickname(namechange,"Name Change sponsored by Monokuma").then(()=>{
                util.save(nicks,"nicks");
                message.delete(namechange);
                message.member.removeRole(message.guild.roles.find("name","⭕ Nickname Change"),"Nickname change")
            })
            break
    }
}) 



client.login(config.token)
