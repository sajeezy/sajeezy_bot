
const axios = require("axios");
function sendMessage(url, message, reply, res) {
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
}

module.exports.sendMessage = sendMessage;