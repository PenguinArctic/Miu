const Discord = require("discord.js");
const client = new Discord.Client();

var nicks = require('./nicks.json');
var fs = require("fs");

client.on("ready", () => {
    console.log("I am ready!");
});


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

client.login("Mzc0NTE1MTQyOTg3MzUwMDE3.DNiqIA.fewmr4c_M68EyhL06Y8icuMy6Kg");