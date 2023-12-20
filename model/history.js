const mongoose = require("mongoose");

const serverHistorySchema = mongoose.Schema({
  guildID: {
    type: String,
    required: [true, "Guild ID not specified"],
  },
  channels: [
    {
      channelID: {
        type: String,
        required: [true, "Channel ID not specified"],
      },
      history: [
        {
          _id: false,
          role: {
            type: String,
            required: [true, "Role not specified"],
          },
          parts: {
            type: String,
            required: [true, "Parts not specified"],
          },
          timestamp: { type: Date, required: true, default: Date.now },
        },
      ],
      _id: false,
    },
  ],
});

const History = mongoose.model("History", serverHistorySchema);
module.exports = History;
