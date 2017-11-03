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
        member.setNickname(nicks[member.id]) 
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
                    message.channel.overwritePermissions(message.guild.roles.get(message.guild.id),{SEND_MESSAGES: false} )
                    break;

                case "panicoff":
                    message.channel.overwritePermissions(message.guild.roles.get(message.guild.id),{SEND_MESSAGES: null} )
                    break;
            }
        }

        switch(message.channel.name){
            case "change-nickname":
                var namechange = message.content + " " + message.member.nickname[message.member.nickname.length -1];
                nicks[message.member.id] = namechange;

                message.member.setNickname(namechange).then(()=>{
                    util.save(nicks,"nicks");
                    message.delete(namechange)
                    message.member.removeRole(message.member.removeRole(message.guild.roles.find("name","⭕ Nickname Change")))
                })
                break
        }
    }   
}) 



client.login(config.token)
