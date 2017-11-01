var config = require("../data/config.json");

client.on('message', message => {
    util.exp(exp,message);
    var prefix = config.prefix;

    if(message.content.startsWith(prefix)){
        var command = {};

        var param = message.content.split(" ");
        param[0] = param[0].split(prefix)[1];

        const commandName = param[0]
        
        switch(commandName){
            
        }
    }
}
          
                                  case "panic off":
                if(message.member.roles.exists("name","Staff Team")){
                    channel.overwritePermissions(guild.roles.find("name","@everyone"),
                                                 {SEND_MESSAGES: null}); 