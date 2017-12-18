const Discord = require("discord.js");
var client = new Discord.Client();

var perms = require("../data/perms.json")
var nicks = require('../data/nicks.json');
var fs = require("fs");
var util = require("../akira/utilities.js")

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

client.on('ready', () => {
	util.log(client,'I am ready!');
});

client.on('debug',info=>{
	if(typeof info === 'string' && !info.startsWith("[ws]")){
		util.log(client,info);
	}
})

client.on('message', message => {
	try{
		var prefix = ">";
		if(message.content.startsWith(prefix) || message.content.startsWith("<@!" + client.user.id + ">")){			
			var param = message.content.split(" ");

			if(message.content.startsWith(prefix)){
				param[0] = param[0].split(prefix)[1];
			}else{
				param.splice(0,1);
			}

			const commandName = param[0]
			if(util.permCheck(message,commandName)){
				if(command == undefined){command = {}; command.type = param[0].toLowerCase()};
				if (!client.commands.has(command.type)) return;
				
				client.commands.get(command.type).execute(client, message, param);
			}
		}

		switch(message.channel.name){
			case "change-nickname":
				if(!message.author.bot){
					var emoji = message.member.nickname.split(" ").pop();

					var namechange = message.content + " " + emoji;
					nicks[message.member.id] = namechange;

					message.member.setNickname(namechange,"Name Change sponsored by Monokuma").then(()=>{
						util.save(nicks,"nicks");
						message.delete(namechange);
						message.member.removeRole(message.guild.roles.find("name","⭕ Nickname Change"),"Nickname change")
					})
				}
				break;

			case "miu":
				util.talk(client,message);
				break;
		}
	}catch(e){
		util.log(client,`${e}\nSource: ${param[0]}`);
	}
}) 

client.login(require("../data/tokens.json").miu)
