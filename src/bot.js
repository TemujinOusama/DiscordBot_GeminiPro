const { config } = require("dotenv");
config();
const mongoose = require("mongoose");
const { Client, GatewayIntentBits } = require("discord.js");
const { handleMessage } = require("./handleReply.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

mongoose
  .connect(process.env.MONGODB_URI) //connect to mongodb
  .then(() => {
    console.log("🟢 connected to MongoDB...");

    client.on("ready", (c) => {
      console.log(`🟢 ${c.user.tag} is online`);
    });

    client.on("messageCreate", async (message) => {
      handleMessage(message);
    });

    client.login(process.env.BOT_TOKEN);
  })
  .catch((error) => {
    console.error(error);
  });
