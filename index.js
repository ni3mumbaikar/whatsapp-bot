import { WAConnection, MessageType, Mimetype } from "@adiwajshing/baileys";
import * as WSF from "wa-sticker-formatter";
import { rejects } from "assert";
import * as fs from "fs";
import { resolve } from "path";

const path = "./auth_info.json";
var conn = null;

async function connectToWhatsApp() {
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
    await conn.connect();
  } catch (err) {
    console.error(err);
  }
  // called when WA sends chats
  // this can take up to a few minutes if you have thousands of chats!

  conn.on("chat-update", async (chatUpdate) => {
    // `chatUpdate` is a partial object, containing the updated properties of the chat
    // received a new message
    if (chatUpdate.messages && chatUpdate.count) {
      const message = chatUpdate.messages.all()[0];
      if (
        message.message.conversation &&
        message.message.conversation.startsWith("/")
      ) {
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
            "  LIST OF AVAILABLE COMMANDS FOR YOU  \n\n" +
            "1. */status* : To check this bot is online or not\n\n" +
            "2. */caps your_text* : To return back the text all chars in capital letters \n\n" +
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
        const buffer = await conn.downloadMediaMessage(message); // to decrypt & use as a buffer

        const path = "./undefined.jpeg";
        const path2 = "/undefined.png";
        const path3 = "/undefined.gif";

        const sticker = new WSF.Sticker(buffer, {
          crop: true,
          animated: false,
          pack: "hard",
          author: "unknown",
        });
        await sticker.build();
        const sticBuffer = await sticker.get();

        conn.sendMessage(
          message.key.remoteJid,
          sticBuffer,
          MessageType.sticker
        );

        console.log("IMAGE DETECTED");
        const msg = "IMAGE DETECTED";
      }
    } //else console.log(chatUpdate); // see updates (can be archived, pinned etc.)
  });
}

// run in main file
connectToWhatsApp().catch((err) => console.log("unexpected error: " + err)); // catch any errors
