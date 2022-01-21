// Supports ES6
import { create, Whatsapp } from "venom-bot";
import dialogflow from "./utils/dialogflow";

create({
  session: "session-name", //name of session
  //   multidevice: false, // for version not multidevice use false.(default: true)
})
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

const start = (client: Whatsapp) => {
  client.onMessage(async (message) => {
    const sessionId = message.sender.id;
    let response = await dialogflow.sendToDialogFlow(message.body, sessionId);
    if (response) {
      response.fulfillmentMessages?.forEach(async (msg) => {
        if (msg.text?.text) {
          await client
            .sendText(message.from, msg?.text?.text[0])
            .then((result) => {
              console.log("Result: ", result); //return object success
            })
            .catch((erro) => {
              console.error("Error when sending: ", erro); //return object error
            });
        }
      });
    }
  });
};
