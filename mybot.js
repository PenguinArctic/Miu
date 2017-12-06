const Discord = require("discord.js");
var client = new Discord.Client();

var config = require("../data/dvaconfig.json")
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
						if(message.mentions.members.size == 0){
							message.channel.send("User to mute not mentioned");
							return;
						}

						var time;
						var reason = param.slice(3);
						if(isNaN(parseInt(param[2]))){
							time = 0
							reason = param.slice(2);
						}
						message.mentions.members.first().addRole(message.guild.roles.find("name","Muted")).then(member=>{
							if(time>0){
								setTimeout(function(){
									if(member.roles.exists("name","Muted")){
										member.removeRole(message.guild.roles.find("name","Muted"));
									}
								},time*60000)
							}
						})

						break;

					case "unmute":
						if(message.mentions.members.size == 0){
							message.channel.send("User to unmute not mentioned");
							return;
						}
						if(message.mentions.members.first().roles.exists("name","Muted")){
							message.mentions.members.first().removeRole(message.guild.roles.find("name","Muted"));
						}else{
							message.channel.send(`${message.mentions.members.first().nickname || message.mentions.users.first().username} is not muted`)
						}
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
		}
	}catch(e){
		util.log(client,e);
	}
}) 

client.login(config.token)
