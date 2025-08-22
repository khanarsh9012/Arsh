const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ytSearch = require("yt-search");
const https = require("https");
const ytdl = require("ytdl-core");

module.exports = {
  config: {
    name: "music",
    version: "2.0.0",
    author: "Lord Axshu",
    description: "Download YouTube song from keyword search or link",
    category: "media",
    guide: { en: "{pn} [songName] [audio/video]" }
  },

  onStart: async function ({ api, event, args }) {
    let songName, type;

    if (
      args.length > 1 &&
      (args[args.length - 1] === "audio" || args[args.length - 1] === "video")
    ) {
      type = args.pop();
      songName = args.join(" ");
    } else {
      songName = args.join(" ");
      type = "audio";
    }

    if (!songName) {
      return api.sendMessage("❌ Please provide a song name or keyword.", event.threadID, event.messageID);
    }

    const processingMessage = await api.sendMessage("✅ Processing your request. Please wait...", event.threadID);

    try {
      const searchResults = await ytSearch(songName);
      if (!searchResults || !searchResults.videos.length) {
        throw new Error("No results found for your search query.");
      }

      const topResult = searchResults.videos[0];
      const videoId = topResult.videoId;

      // ⏳ Max duration = 10 minutes
      if (topResult.seconds > 600) {
        return api.sendMessage(
          "❌ Only songs under 10 minutes are allowed.",
          event.threadID,
          () => api.unsendMessage(processingMessage.messageID)
        );
      }

      const safeTitle = topResult.title.replace(/[^a-zA-Z0-9 \-_]/g, "");
      const filename = `${Date.now()}_${safeTitle}.${type === "audio" ? "mp3" : "mp4"}`;
      const downloadDir = path.join(__dirname, "cache");
      const downloadPath = path.join(downloadDir, filename);

      if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir, { recursive: true });
      }

      api.setMessageReaction("⌛", event.messageID, () => {}, true);

      // 🌐 API Download (primary)
      const apiKey = "priyansh-here";
      const apiUrl = `https://priyansh-ai.onrender.com/youtube?id=${videoId}&type=${type}&apikey=${apiKey}`;

      let success = false;
      try {
        const downloadResponse = await axios.get(apiUrl);
        if (downloadResponse.data && downloadResponse.data.downloadUrl) {
          const downloadUrl = downloadResponse.data.downloadUrl;

          await new Promise((resolve, reject) => {
            const file = fs.createWriteStream(downloadPath);
            https.get(downloadUrl, (response) => {
              if (response.statusCode === 200) {
                response.pipe(file);
                file.on("finish", () => {
                  file.close(resolve);
                });
              } else {
                reject(new Error(`API download failed. Status code: ${response.statusCode}`));
              }
            }).on("error", reject);
          });

          success = true;
        }
      } catch (err) {
        console.warn("⚠️ API failed, switching to fallback:", err.message);
      }

      // 🎵 Fallback: ytdl-core direct download
      if (!success) {
        await new Promise((resolve, reject) => {
          const stream = ytdl(`https://youtube.com/watch?v=${videoId}`, {
            filter: type === "audio" ? "audioonly" : "videoandaudio",
            quality: type === "audio" ? "highestaudio" : "highest"
          }).pipe(fs.createWriteStream(downloadPath));

          stream.on("finish", resolve);
          stream.on("error", reject);
        });
      }

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      // Send file
      await api.sendMessage(
        {
          attachment: fs.createReadStream(downloadPath),
          body: `🖤 Title: ${topResult.title}\n\nHere is your ${type === "audio" ? "audio" : "video"} 🎧:`
        },
        event.threadID,
        () => {
          fs.unlinkSync(downloadPath);
          api.unsendMessage(processingMessage.messageID);
        },
        event.messageID
      );

    } catch (error) {
      console.error(`❌ Failed to process song: ${error.message}`);
      api.sendMessage(`❌ Failed to download song: ${error.message}`, event.threadID, () => api.unsendMessage(processingMessage.messageID));
    }
  }
};
