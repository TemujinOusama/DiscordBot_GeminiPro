const { getResponse } = require("./gemini.js");
const { saveToDatabase } = require("./saveToDatabase.js");
const { pacq } = require("./utils.js");
async function handleMessage(message) {
  if (message.content.length === 0) return;

  const variables = pacq(message);
  if (message.author.bot) {
    saveToDatabase(message);
    return;
  } else if (!message.content.startsWith(variables.prefix)) {
    return;
  }
  saveToDatabase(message);
  await message.channel.sendTyping();

  if (variables.command == "ask" || message.author.bot) {
    //check if the question is blank
    if (variables.question.trim() === "") {
      message.reply(
        "Please add a question after the command : !<ask> [question]"
      );
      return;
    }
    const response = await getResponse(message, variables.question);

    if (response.length > 1900) {
      for (let i = 0; i < response.length; i += 1900) {
        await message.channel.sendTyping();
        const text = response.slice(i, i + 1900);
        if (text.length < 1900) {
          await message.reply(`${text} `);
        } else {
          await message.reply(`${text} \n(to be continued...)`);
        }
        await new Promise((resolve) => {
          setTimeout(resolve, 400);
        });
      }
    } else {
      message.reply(response);
    }
  } else {
    message.channel.send("command not recognized...");
  }
}

module.exports = { handleMessage };
