module.exports = {
    desc:"This is a description",
    execute(client, message, param){
try{
        message.channel.overwritePermissions(message.guild.roles.get(message.guild.id),{SEND_MESSAGES:true} ,"EVERYBODY PANIC").then(ch=>{
            ch.send("This channel has been unblocked")
        })
    }
catch(e){
util.log(client,`${e}
Source: ${__filename.split('/root/bots/')[1]}`)
}
}
}