// Dependencies
const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { sendMessage } = require("./helpers/sendMessage");

require("dotenv").config();

const port = process.env.PORT || 80;
const url = "https://api.telegram.org/bot";
const apiToken = process.env.BOT_TOKEN;
const telegram_url = `${url}${apiToken}/sendMessage`;

// Configurations
app.use(bodyParser.json());
// Endpoints
app.post("/", (req, res) => {
  //   console.log(req.body);
  const message = req.body.message;
  const sentMessage = message.text;

  // Regex for hello
  if (sentMessage.match(/hello/gi)) {
    sendMessage(telegram_url, message, "my guy 👊🏾", res);
  } else {
    // if no hello present, just respond with 200
    res.status(200).send({});
    // res.send(req.body);
  }
});

// app.post("/start_bot", (req, res) => {
//     const { message } = req.body;
// });

// Listening
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
