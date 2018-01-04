module.exports = {
    desc:"This is a description",
    execute(client, message, param){
try{
        message.channel.bulkDelete(parseInt(param[1]) + 1);
    }
catch(e){
util.log(client,`${e}
Source: ${__filename.split('/root/bots/')[1]}`)
}
}
}