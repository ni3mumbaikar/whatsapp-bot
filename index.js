import {
  WAConnection,
  MessageType,
  MessageOptions,
  Mimetypes,
} from "@adiwajshing/baileys";
import * as fs from "fs";

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

// conn.on("chat-update", async (chat) => {
//   // if (chat !== undefined) {
//   //   const m = chat.messages.all()[0]; // pull the new message from the update
//   //   console.log(m);
//   // }

//   if (!chat.hasNewMessage) {
//     if (chat.messages) {
//       console.log("updated message: ", chat.messages.first);
//     }
//     return;
//   }
// });

conn.on("chat-update", (chatUpdate) => {
  // `chatUpdate` is a partial object, containing the updated properties of the chat
  // received a new message
  if (chatUpdate.messages && chatUpdate.count) {
    const message = chatUpdate.messages.all()[0];
    if (message.key.remoteJid == "917208160712@s.whatsapp.net") {
      console.log(message);
      if (message.message == "/status" || message.message == "/help") {
      }
    }
  } //else console.log(chatUpdate); // see updates (can be archived, pinned etc.)
});

await conn.connect(); // connect
