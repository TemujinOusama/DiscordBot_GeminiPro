function pacq(message) {
  if (message.author.bot) {
    return;
  }
  const prefix = "!";
  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  const question = args.join(" ");

  return { prefix: prefix, command: command, question: question };
}

module.exports = { pacq };
