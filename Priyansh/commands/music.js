const fs = require("fs");
const path = require("path");
const ytSearch = require("yt-search");
const ytdl = require("ytdl-core");

module.exports = {
  config: {
    name: "music",
    version: "2.1.0",
    author: "LordAxshu",
    description: "Download YouTube song directly (no API required)",
    category: "media",
    guide: { en: "{pn} [songName]" }
  },

  onStart: async function ({ api, event, args }) {
    const songName = args.join(" ");
    if (!songName) {
      return api.sendMessage("❌ Please provide a song name.", event.threadID, event.messageID);
    }

    const processingMessage = await api.sendMessage("✅ Searching YouTube...", event.threadID);

    try {
      // 🔎 Search song
      const searchResults = await ytSearch(songName);
      if (!searchResults || !searchResults.videos.length) {
        throw new Error("No results found.");
      }

      const topResult = searchResults.videos[0];
      if (topResult.seconds > 600) {
        return api.sendMessage(
          "❌ Only songs under 10 minutes are allowed.",
          event.threadID,
          () => api.unsendMessage(processingMessage.messageID)
        );
      }

      const safeTitle = topResult.title.replace(/[^a-zA-Z0-9 \-_]/g, "");
      const filename = `${Date.now()}_${safeTitle}.mp3`;
      const downloadDir = path.join(__dirname, "cache");
      const downloadPath = path.join(downloadDir, filename);

      if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir, { recursive: true });
      }

      api.setMessageReaction("⌛", event.messageID, () => {}, true);

      // 🎶 Direct YouTube download
      await new Promise((resolve, reject) => {
        const stream = ytdl(topResult.url, { filter: "audioonly", quality: "highestaudio" })
          .pipe(fs.createWriteStream(downloadPath));
        stream.on("finish", resolve);
        stream.on("error", reject);
      });

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      // 📤 Send file
      await api.sendMessage(
        {
          attachment: fs.createReadStream(downloadPath),
          body: `🎶 Title: ${topResult.title}\nDuration: ${topResult.timestamp}\n\nHere is your song 🎧`
        },
        event.threadID,
        () => {
          fs.unlinkSync(downloadPath);
          api.unsendMessage(processingMessage.messageID);
        },
        event.messageID
      );

    } catch (error) {
      console.error(error);
      api.sendMessage(
        `❌ Failed: ${error.message}`,
        event.threadID,
        () => api.unsendMessage(processingMessage.messageID)
      );
    }
  }
};
