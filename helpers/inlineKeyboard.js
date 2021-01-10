// Inline keyboard options
const inlineKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "YES",
          callback_data: JSON.stringify({
            command: "/obt",
            answer: "YES",
          }),
        },
        {
          text: "NO",
          callback_data: JSON.stringify({
            command: "/start",
            answer: "NO",
          }),
        },
      ],
    ],
  },
};

module.exports.inlineKeyboard = inlineKeyboard;