module.exports.config = {
  name: "goiadmin",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Jamal Pathan",
  description: "Bot will rep ng tag admin or rep ng tagbot ",
  commandCategory: "Other",
  usages: "",
  cooldowns: 1
};
module.exports.handleEvent = function({ api, event }) {
  if (event.senderID !== "100071943783967") {
    var aid = ["100071943783967"];
    for (const id of aid) {
    if ( Object.keys(event.mentions) == id) {
      var msg = ["Jamal Busy Ha mujhe Bolo Kya Bolna H?", "Kya Hua Jamal Boss ko q Bula Rhe Ho?", "Jamal Shayad Busy hoga", "Jamal Toh Chala gaya"];
      return api.sendMessage({body: msg[Math.floor(Math.random()*msg.length)]}, event.threadID, event.messageID);
    }
    }}
};
module.exports.run = async function({}) {
        }
