const History = require("../model/history");

const { config } = require("dotenv");
config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getResponse(message, question) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // For text-only input-response, use the gemini-pro model

  //const guild = await History.findOne({ guildID: message.guildId });
  // const channel = guild.channels.find(
  //   (result) => result.channelID === message.channelId
  // );
  //const history = channel.history;
  //console.log(history);

  // let chat;
  // if (history.length < 2) {
  //   chat = model.startChat({
  //     history: [
  //       {
  //         role: "user",
  //         parts:
  //           "You are a discord bot that would respond to user queries and also respond to conversational queries. An please limit your responses to 2000 length",
  //       },
  //       {
  //         role: "model",
  //         parts: "That's exciting! I'm happy to be part of your project.",
  //       },
  //     ],
  //   });
  // } else {
  //   chat = model.startChat({
  //     history: history,
  //   });
  // }
  chat = model.startChat({
    history: [
      {
        role: "user",
        parts:
          "You are a discord bot that would respond to user queries and also respond to conversational queries. An please limit your responses to 2000 length",
      },
      {
        role: "model",
        parts: "That's exciting! I'm happy to be part of your project.",
      },
    ],
  });

  const msg = question;

  try {
    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    //catch harmful content
    const geminiError = error.response.promptFeedback.safetyRatings.filter(
      (item) => item.probability === "MEDIUM" || item.probability === "HIGH"
    );
    let harm = "";
    for (let i = 0; i < geminiError.length; i++) {
      harm =
        harm +
        "\n" +
        `**Category**:  *${geminiError[i].category}*\t**Probability**: *${geminiError[i].probability}*`;
    }
    console.log(harm);
    return `***Safety concern detected***: ${harm}`;
  }
}

module.exports = { getResponse };
