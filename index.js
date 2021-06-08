import { WAConnection, MessageType, Mimetype } from "@adiwajshing/baileys";
import { rejects } from "assert";
import * as fs from "fs";
import { resolve } from "path";

const path = "./auth_info.json";
var conn = null;

try {
  if (fs.existsSync(path)) {
    conn = new WAConnection();
    conn.loadAuthInfo("./auth_info.json");
  } else {
    conn = new WAConnection();
    // this will be called as soon as the credentials are updated
    conn.on("open", () => {
      // save credentials whenever updated
      console.log(`credentials updated!`);
      const authInfo = conn.base64EncodedAuthInfo(); // get all the auth info we need to restore this session
      fs.writeFileSync(
        "./auth_info.json",
        JSON.stringify(authInfo, null, "\t")
      ); // save this info to a file
    });
  }
} catch (err) {
  console.error(err);
}

// TODO: CHECK EXISTING CONNECTION

conn.on("qr", (qr) => {
  // Now, use the 'qr' string to display in QR UI or send somewhere
  console.log(qr);
});

conn.on("chat-update", (chatUpdate) => {
  // `chatUpdate` is a partial object, containing the updated properties of the chat
  // received a new message
  if (chatUpdate.messages && chatUpdate.count) {
    const message = chatUpdate.messages.all()[0];
    if (message.message.conversation.startsWith("/")) {
      console.log(message);
      console.log("MyMessage : " + message.message.conversation);
      if (message.message.conversation == "/status") {
        const sentMsg = conn.sendMessage(
          message.key.remoteJid,
          "Aye aye captain !",
          MessageType.text
        );
      } else if (message.message.conversation == "/help") {
        const commands =
          "  LIST OF AVAILALE COMMANDS FOR YOU  \n\n" +
          "1. */status* : To check bot is online or not\n\n" +
          "2. */caps your_text* : To return to text in all capital letters \n\n" +
          "3. */sticker* : Use /sticker as caption of any image to get it's sticker (work in progress)\n\n" +
          "4. */about* : To know more about me (work in progress)";
        const sentMsg = conn.sendMessage(
          message.key.remoteJid,
          commands,
          MessageType.text
        );
      } else if (message.message.conversation.startsWith("/caps")) {
        const msg = message.message.conversation
          .toUpperCase()
          .replace("/CAPS", " ");
        const sentMsg = conn.sendMessage(
          message.key.remoteJid,
          msg,
          MessageType.text
        );
      } else if (message.message.conversation == "/about") {
        const msg = "Ruko jara sabar karo ! Bana raha hu features :D ";
        const sentMsg = conn.sendMessage(
          message.key.remoteJid,
          msg,
          MessageType.text
        );
      } else if (message.message.conversation.startsWith("/sticker")) {
        const msg = "No image found";
        const sentMsg = conn.sendMessage(
          message.key.remoteJid,
          msg,
          MessageType.text
        );
      }
    } else if (
      message.message.imageMessage &&
      message.message.imageMessage.caption &&
      message.message.imageMessage.caption.startsWith("/sticker")
    ) {
      console.log("IMAGE DETECTED");
      const msg = "IMAGE DETECTED";
      const sentMsg = conn.sendMessage(
        message.key.remoteJid,
        msg,
        MessageType.text
      );
    }
  } //else console.log(chatUpdate); // see updates (can be archived, pinned etc.)
});

await conn.connect(); // connect
