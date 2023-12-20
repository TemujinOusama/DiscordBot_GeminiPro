const History = require("../model/history");
const { pacq } = require("./utils.js");

async function saveToDatabase(message) {
  if (message.content.startsWith("!!") && message.author.bot) {
    return;
  }
  const variable = pacq(message);
  const role = message.author.bot ? "model" : "user";
  const parts = message.author.bot ? message.content : variable.question;
  const guild = await History.findOne({ guildID: message.guildId });

  //if server is listed on mongodb
  if (guild) {
    const channel = guild.channels.find(
      (result) => result.channelID === message.channelId
    );
    //if the channel is on the server in mongodb
    if (channel) {
      channel.history.push({
        role: role,
        parts: parts,
      });
      await guild.save();
    }
    //the channel is not on mongodb yet
    else {
      guild.channels.push({
        channelID: message.channelId,
        history: [
          {
            role: role,
            parts: parts,
          },
        ],
      });
      await guild.save();
    }
  }
  //create the instance if server does not exist
  else {
    await History.create({
      guildID: message.guildId,
      channels: [
        {
          channelID: message.channelId,
          history: [
            {
              role: role,
              parts: parts,
            },
          ],
        },
      ],
    });
  }
}

module.exports = { saveToDatabase };
