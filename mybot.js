const Discord = require("discord.js");
const client = new Discord.Client();

var config = require("../data/dvaconfig.json")
var nicks = require('./nicks.json');
var fs = require("fs");



client.on("message", (message) => {  
    if(message.channel.name == "change-nickname"){
        var namechange = message.content
        nicks[message.member.id] = namechange;

        message.member.setNickname(namechange).then(()=>{            
            fs.writeFile("./nicks.json", JSON.stringify(nicks),"utf-8", function(){});   
            message.delete(namechange)
            message.member.removeRole(message.member.removeRole(message.guild.roles.find("name","⭕ Nickname Change")))  
        })           
    }
});

client.on("guildMemberAdd", (member) => {
    var name = member.user.username;
    if(nicks [member.id]== undefined) { 
        member.setNickname(name);
        nicks [member.id] = name;
        fs.writeFile("./nicks.json", JSON.stringify(nicks),"utf-8", function(){});
    }else{
        member.setNickname(nicks[member.id]) 
    }
});



client.on('message', message => {
    var prefix = ">";

     if(message.channel.name == "change-nickname"){
        var namechange = message.content
        nicks[message.member.id] = namechange;

        message.member.setNickname(namechange).then(()=>{
            fs.writeFile("./nicks.json", JSON.stringify(nicks),"utf-8", function(){});
            message.delete(namechange)
            message.member.removeRole(message.member.removeRole(message.guild.roles.find("name","⭕ Nickname Change")))
    }




    if(message.content.startsWith(prefix)){
        var command = {};

        var param = message.content.split(" ");
        param[0] = param[0].split(prefix)[1];

        const commandName = param[0]

        switch(commandName){

            case "panic":
                if(message.member.roles.exists("name","Staff Team")){ //
                    message.channel.overwritePermissions(message.guild.roles.get(message.guild.id),{SEND_MESSAGES: false} )  
                }    
                break;
                
                
                            case "panicoff":
                if(message.member.roles.exists("name","Staff Team")){ //
                    message.channel.overwritePermissions(message.guild.roles.get(message.guild.id),{SEND_MESSAGES: null} )  
                }    
                break;
                
            
        } 
    }   
}) 



client.login(config.token)
