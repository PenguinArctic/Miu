const Discord = require("discord.js");
var client = new Discord.Client();

var perms = require("../data/perms.json")
var nicks = require('../data/nicks.json');
var fs = require("fs");
var util = require("../akira/utilities.js")

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands');
const commonCommands = fs.readdirSync('../akira/commonCommands');
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
	client.commands.set(file.split(".js")[0], command);
	if(command.alias){
		command.alias.forEach(alias => client.commands.set(alias, command))
	}
}
for (const file of commonCommands) {
    const command = require(`../akira/commonCommands/${file}`);
	client.commands.set(file.split(".js")[0], command);
	if(command.alias){
		command.alias.forEach(alias => client.commands.set(alias, command))
	}
}

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

			const commandName = param[0].toLowerCase();

			if(util.permCheck(message,commandName)){
				if (!client.commands.has(commandName)) return;				
				client.commands.get(commandName).execute(client, message, param);
			}
		}

		switch(message.channel.name){
			case "nickname-change":
				if(!message.author.bot){
					var emoji = message.member.nickname.split(" ").pop();

					var namechange = message.content + " " + emoji;
					if(namechange.length < 32){
						nicks[message.member.id] = namechange;

						message.member.setNickname(namechange,"Name Change sponsored by Monokuma").then(()=>{
							util.save(nicks,"nicks");
							message.delete(namechange);
							message.member.removeRole(message.guild.roles.find("name","⭕ Nickname Change"),"Nickname change")
						})
					}else{
						message.delete();
						message.author.send("That nickname is too long");
					}
				}
				break;

			case "miu":
				util.talk(client,message);
				break;
		}
	}catch(e){
		util.log(client,`${e}\nSource: ${__filename.split("/root/bots/")[1]}`);
	}
}) 

client.login(require("../data/tokens.json").miu)
