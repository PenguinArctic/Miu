var perms = require("../../data/perms.json")

module.exports = {
    desc:"This is a description",
    execute(client, message, param){
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

                    case "remove":
                        if(message.mentions.users.size > 0){
                            var index = perms[name].user.indexOf(message.mentions.users.first().id);
                            if(index >= 1){
                                perms[name].user.splice(index, 1);
                            }
                        }else if(message.mentions.channels.size > 0){
                            var index = perms[name].channel.indexOf(message.mentions.channels.first().id);
                            if(index >= 1){
                                perms[name].channel.splice(index, 1);
                            }
                        }else{
                            var index = perms[name].role.indexOf(param.join(" "));
                            if(index >= 1){
                                perms[name].role.splice(index, 1);
                            }
                        }
                        
                        result[0].perms = result[0].perms.filter(e => e !== param.join(" ") );
                        perms.save(result[0]);
                        message.reply("Removed " + param.join(" ") + " from the command " + name);
                        break;
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
    }
}