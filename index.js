// Dependencies
const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const bodyParser = require("body-parser");
const { sendMessage } = require("./helpers/sendMessage");
const { isUrlValid } = require("./helpers/utils");
const { inlineKeyboard } = require("./helpers/inlineKeyboard");
const { requestPhoneKeyboard } = require("./helpers/requestPhoneKeyboard");

require("dotenv").config();

const port = process.env.PORT || 80;
const url = "https://api.telegram.org/bot";
const token = process.env.BOT_TOKEN;
const telegram_url = `${url}${token}/sendMessage`;
let bot;

if (process.env.NODE_ENV === "production") {
  bot = new TelegramBot(token);
  bot.setWebHook(process.env.HEROKU_URL + bot.token);
} else {
  bot = new TelegramBot(token, { polling: true });
}

// In-memory storage
const URLs = [];
const URLLabels = [];
let tempSiteURL = '';

const OBTs = [];
const OBTLabels = [];
let tempOBT = '';

// listen for /bookmark
// Listener (handler) for telegram's /bookmark event
bot.onText(/\/bookmark/, (msg, match) => {
   const chatId = msg.chat.id;
  const url = match.input.split(' ')[1];

   if (url === undefined) {
       bot.sendMessage(
           chatId,
           'Please provide URL of article!',
       );
       return;
   }

   URLs.push(url);
   bot.sendMessage(
       chatId,
       'URL has been successfully saved!',
   );
});
// Listener (handler) for telegram's /label event
bot.onText(/\/obt/, (msg, match) => {
    const chatId = msg.chat.id;
  const obt = msg.text.replace("/obt", "");
  console.log
    if (obt === undefined) {
      bot.sendMessage(chatId, "Please provide today's One Big Thing!");
      return;
    }
  tempOBT = obt;
    bot.sendMessage(
      chatId,
      `Today's One Big thing:\n✨ ${tempOBT} ✨ \nhas been successfully saved 👊🏾!`,
      {
        reply_markup: {
          one_time_keyboard: true,
          resize_keyboard: true,
          force_reply: true,
          inline_keyboard: [
            [
              {
                text: "🖥",
                callback_data: "development",
              },
              {
                text: "🖋",
                callback_data: "writing",
              },
              {
                text: "💼",
                callback_data: "sales",
              },
              {
                text: "🤔",
                callback_data: "personal",
              },
              {
                text: "👀",
                callback_data: "other",
              },
            ],
          ],
        },
      }
    );
});

// Listener (handler) for callback data from /obt command
bot.on('callback_query', (callbackQuery) => {
  const { message, data } = callbackQuery;
   OBTLabels.push({
       obt: tempOBT,
       label: data,
   });

   tempOBT = '';

   bot.sendMessage(message.chat.id, `OBT has been labelled with category "${data}"`);
});

// Listener (handler) for telegram's /label event
bot.onText(/\/label/, (msg, match) => {
    const chatId = msg.chat.id;
    const url = match.input.split(' ')[1];

    if (url === undefined) {
        bot.sendMessage(
            chatId,
            'Please provide URL of article!',
        );
        return;
    }

    tempSiteURL = url;
    bot.sendMessage(
        chatId,
        'URL has been successfully saved!',
        {
            reply_markup: {
                inline_keyboard: [[
                    {
                        text: 'Development',
                        callback_data: 'development'
                    }, {
                        text: 'Lifestyle',
                        callback_data: 'lifestyle'
                    }, {
                        text: 'Other',
                        callback_data: 'other'
                    }
                ]]
            }
        }
    );
});

// Listener (handler) for callback data from /label command
// bot.on('callback_query', (callbackQuery) => {
//   const { message, query } = callbackQuery;

//    URLLabels.push({
//        url: tempSiteURL,
//        label: category,
//    });

//    tempSiteURL = '';

//    bot.sendMessage(message.chat.id, `URL has been labelled with category "${category}"`);
// });

// Listener (handler) for showcasing different keyboard layout
bot.onText(/\/keyboard/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Alternative keyboard layout', {
        'reply_markup': {
            'keyboard': [['Sample text', 'Second sample'], ['Keyboard'], ['I\'m robot']],
            resize_keyboard: true,
            one_time_keyboard: true,
            force_reply: true,
        }
    });
});


// Listener (handler) for showcasing inline keyboard layout
bot.onText(/\/inline/, (msg) => {
    bot.sendMessage(msg.chat.id, 'You have to agree with me, OK?', inlineKeyboard);
});

// Listener (handler) for retrieving phone number
bot.onText(/\/phone/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Can we get access to your phone number?', requestPhoneKeyboard);
});

// Handler for phone number request when user gives permission
bot.on('contact', async (msg) => {
    const phone = msg.contact.phone_number;
    bot.sendMessage(msg.chat.id, `Phone number saved: ${phone}`);
})

const app = express();

app.use(bodyParser.json());

app.listen(process.env.PORT);

app.post("/" + bot.token, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// https://soshace.com/building-a-telegram-bot-with-node-js/
// https://scotch.io/tutorials/how-to-build-a-telegram-bot-using-nodejs-and-now#toc-deploying-our-bot-with-now
// https://www.sitepoint.com/how-to-build-your-first-telegram-chatbot-with-node-js/