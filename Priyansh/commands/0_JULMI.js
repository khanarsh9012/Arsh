const fs = require("fs");
module.exports.config = {
    name: "Julmi",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Arun", 
    description: "no prefix",
    commandCategory: "No command marks needed",
    usages: "...",
    cooldowns: 100, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
    var { threadID, messageID } = event;
    if (!event.body) return; // agar message khali ho toh ignore
    let react = event.body.toLowerCase();

    // list of keywords jo trigger karenge
    const keywords = ["jamal", "boss", "admin"];

    if (keywords.includes(react)) {
        var msg = {
            body: "★𝗢𝘄𝗻𝗲𝗿ﮩ٨ـﮩ💚💖ـ٨\n\n✦🌸===『*★🌸◉❖जमाल❖◉✦\n\n★★᭄𝐈𝐍𝐒𝐓𝐀𝐆𝐑𝐀𝐌 𝐋𝐈𝐍𝐊 𝐌𝐄𝐑𝐄 𝐁𝐎𝐒𝐒 𝐊𝐀 :\n\n✦ https://www.instagram.com/alex972740?igsh=MWNpbDFnMzYyM3p5Nw==  ✦ \n𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 𝐋𝐈𝐍𝐊 𝐌𝐄𝐑𝐄 𝐁𝐎𝐒𝐒 𝐊𝐀😁😋 https://www.facebook.com/share/16mueuhpoH/",
        }
        api.sendMessage(msg, threadID, messageID);
        api.setMessageReaction("📷", event.messageID, (err) => {}, true);
    }
}

module.exports.run = function({ api, event, client, __GLOBAL }) {

							   }
