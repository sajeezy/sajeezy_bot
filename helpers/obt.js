// Keyboard layout for requesting phone number access
const obt = {
  reply_markup: {
    one_time_keyboard: true,
    keyboard: [
      [
        {
          text: "What's today's One Big Thing ?",
        //   request_contact: true,
          one_time_keyboard: true,
        },
      ],
    ],
  },
};

module.exports.obt = obt;
