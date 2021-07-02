import { WAConnection, MessageType, Mimetype } from "@adiwajshing/baileys";
import * as WSF from "wa-sticker-formatter";
import { rejects } from "assert";
import * as fs from "fs";
import { resolve } from "path";

const path = "./auth_info.json";
var conn = null;

async function connectToWhatsApp() {
  try {
    conn = new WAConnection();
    if (fs.existsSync(path)) {
      conn.loadAuthInfo("./auth_info.json");
      await conn.connect();
    } else {
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
      await conn.connect();
    }
  } catch (err) {
    console.error(err);
  }
  // called when WA sends chats
  // this can take up to a few minutes if you have thousands of chats!

  conn.on("chat-update", async (chatUpdate) => {
    // `chatUpdate` is a partial object, containing the updated properties of the chat
    // received a new message
    if (!chatUpdate.messages) {
      return;
    }
    const message = chatUpdate.messages.all()[0];
    if (
      chatUpdate.messages &&
      chatUpdate.count &&
      (String(message.key.remoteJid).endsWith("1569851878@g.us") || // kalakars
        String(message.key.remoteJid).endsWith("1582473504@g.us") || //imp stuff
        String(message.key.remoteJid).endsWith("1455546107@g.us")) // mafiya
    ) {
      console.log(message);
      if (
        message.message &&
        (message.message.conversation != undefined ||
          message.message.conversation != null) &&
        message.message.conversation.startsWith("/")
      ) {
        console.log("MyMessage : " + message.message.conversation);
        var messageType = Object.keys(message.message)[0];
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
            "3. */sticker* : Use /sticker as caption of any image to get it's sticker \n\n" +
            "4. */about* : To know more about me\n\n" +
            "*What's New*\nYou can now send /sticker as reply to any image in the group to get it's sticker";
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
          const msg =
            "bot by ni3mumbaikar [ https://www.linkedin.com/in/ni3mumbaikar/ ]";
          const sentMsg = conn.sendMessage(
            message.key.remoteJid,
            msg,
            MessageType.text
          );
        } else if (message.message.conversation == "/sticker") {
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
        message.message.imageMessage.caption == "/sticker"
      ) {
        const buffer = await conn.downloadMediaMessage(message); // to decrypt & use as a buffer
        console.log(message);
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
      } else if (
        message.message.videoMessage &&
        message.message.videoMessage.gifPlayback &&
        message.message.videoMessage.caption == "/sticker"
      ) {
        const buffer = await conn.downloadMediaMessage(message);
        const sticker = new WSF.Sticker(buffer, {
          crop: true,
          animated: true,
          pack: "hard",
          author: "unknown",
        });

        await sticker.build();
        const sticBuffer = sticker.get();

        conn.sendMessage(
          message.key.remoteJid,
          sticBuffer,
          MessageType.sticker
        );
      } else if (
        message.message.extendedTextMessage &&
        message.message.extendedTextMessage.text == "/sticker" &&
        (message.message.extendedTextMessage.contextInfo.quotedMessage
          .imageMessage ||
          (message.message.extendedTextMessage.contextInfo.quotedMessage
            .videoMessage &&
            message.message.extendedTextMessage.contextInfo.quotedMessage
              .videoMessage.gifPlayback))
      ) {
        var ogmessage = await conn.loadMessage(
          message.key.remoteJid,
          message.message.extendedTextMessage.contextInfo.stanzaId
        );
        console.log(ogmessage);
        const buffer = await conn.downloadMediaMessage(ogmessage); // to decrypt & use as a buffer
        console.log(ogmessage);
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
      }
    } //else console.log(chatUpdate); // see updates (can be archived, pinned etc.)
  });
}

// run in main file
connectToWhatsApp().catch((err) => console.log("unexpected error: " + err)); // catch any errors
