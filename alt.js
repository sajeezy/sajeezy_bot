

const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const express = require("express");
const bodyParser = require("body-parser");
const { sendMessage } = require("./helpers/sendMessage");
require("dotenv").config();

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

// Matches "/word whatever"
bot.onText(/\/word (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const word = match[1];
  axios
        .post(url, {
            chat_id: message.chat.id,
            text: reply
        }).then(response => {
            console.log("Message posted");
            // res.end("ok");
            res.status(200).send(response);
        }).catch(error =>{
            console.log(error);
            res.send(error);
        });
    .catch(error => {
      const errorText = error.response.status === 404 ? `No definition found for the word: <b>${word}</b>` : `<b>An error occured, please try again later</b>`;
      bot.sendMessage(chatId, errorText, { parse_mode:'HTML'})
    });
});

const app = express();

app.use(bodyParser.json());

app.listen(process.env.PORT);

app.post("/" + bot.token, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});
