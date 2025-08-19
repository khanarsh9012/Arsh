module.exports.config = {
	name: "offbot",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "Jamal Pathan",
	description: "turn the bot off",
	commandCategory: "system",
	cooldowns: 0
        };
module.exports.run = ({event, api}) =>{
    const permission = ["100071943783967", "100071943783967"];
  	if (!permission.includes(event.senderID)) return api.sendMessage("[ ERR ] You don't have permission to use this command, This Command Only For ─━━◉❖𝗝𝗨𝗟𝗠𝗜≛𝗝𝗔𝗔𝗧❖◉━━─", event.threadID, event.messageID);
  api.sendMessage(`[ OK ] ${global.config.BOTNAME} Bot are now turned off.`,event.threadID, () =>process.exit(0))
}
