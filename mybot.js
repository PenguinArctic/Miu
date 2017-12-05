const Discord = require("discord.js");
const client = new Discord.Client();

var config = require("../data/dvaconfig.json")
var config = require("../data/perms.json")
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

client.on('message', message => {
	try{
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

					case "prune":
						message.channel.bulkDelete(parseInt(param[1]) + 1);
						break;

					case "mute":

						break;

					case "perms":
						var name = param[1];
						var type = param[2];
						param = param.slice(3)
						if(perms[name] != undefined){
							switch(type){
								case "add":
									if(message.mentions.users.size > 0){
										perms[name].user.push(message.mentions.users.first().id);
									}else if(message.mentions.channels.size > 0){
										perms[name].channel.push(message.mentions.channels.first().id);
									}else{
										perms[name].role.push(param.join(" "));
									}
									util.save(perms,"perms");
									message.reply(param.join(" ") + " is now allowed to use " + name);
									break;

									/*case "remove":
                                            result[0].perms = result[0].perms.filter(e => e !== param.join(" ") );
                                            perms.save(result[0]);
                                            message.reply("Removed " + param.join(" ") + " from the command " + name);
                                            break;*/
							}
						}else{
							switch(type){
								case "add":
									perms[name] = {"user":[], "role":[], "channel":[]};

									if(message.mentions.users.size > 0){
										perms[name].user.push(message.mentions.users.first().id);
									}else if(message.mentions.channels.size > 0){
										perms[name].channel.push(message.mentions.channels.first().id);
									}else{
										perms[name].role.push(param.join(" "));
									}

									util.save(perms,"perms");
									message.reply(param.join(" ") + " is now allowed to use " + name);
									break;

								case "delete":
									message.reply("This command has no permissions set");
							}
						}
						break;
				}
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
		}catch(e){
			util.log(client,e);
		}
	}
}) 



client.login(config.token)
