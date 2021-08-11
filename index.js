import { connectToWhatsApp, connection } from "./wa-connection.js";
import { entryExists, connectToDatabase } from "./db-operate-database.js";
import {
  commandHandler,
  stickerMaker,
  loadMessageLocal,
} from "./commandsHandler.js";

connectToWhatsApp().catch((err) => console.log("unexpected error: " + err));
connectToDatabase();

var conn = connection;

// called when WA sends new chats
// this can take up to a few minutes if you have thousands of chats!

conn.on("chat-update", async (chatUpdate) => {
  // `chatUpdate` is a partial object, containing the updated properties of the chat
  // received a new message
  if (!chatUpdate.messages) {
    return;
  }
  const message = chatUpdate.messages.all()[0];
  var key = message.key.remoteJid; //remote id for group and personal message
  if (chatUpdate.messages && chatUpdate.count) {
    if (String(message.key.remoteJid).length > 27) {
      key = key.substring(key.length - 15); //change key to group id for group messages
    }
    // TODO: FIX CROP PARAMETER
    entryExists(String(key)).then((result) => {
      if (
        !(result.length == 0) &&
        String(message.key.remoteJid).endsWith(result[0]["number"])
      ) {
        // Checking if the user is in registered list
        if (
          //Checking it's a normal message not a reply message and starts with /
          message.message &&
          (message.message.conversation != undefined ||
            message.message.conversation != null) &&
          message.message.conversation.startsWith("/")
        ) {
          commandHandler(message);
        } else if (
          // Check the given message is of type image and caption starts with /sticker or not
          message.message &&
          message.message.imageMessage &&
          message.message.imageMessage.caption &&
          String(message.message.imageMessage.caption).startsWith("/sticker")
        ) {
          //crop is checking the parameter is crop if yes then crop else create sticker as it is
          var crop = false;
          if (
            String(message.message.imageMessage.caption).trim() ===
            "/sticker crop"
          ) {
            crop = true;
          }
          stickerMaker(message, "i", crop).catch((err) => console.log(err)); //i for image
        } else if (
          // Check the given message is of type image[video/gif] and caption is /sticker or not
          message.message &&
          message.message.videoMessage &&
          message.message.videoMessage.gifPlayback &&
          String(message.message.videoMessage.caption).startsWith("/sticker")
        ) {
          var crop = false;
          if (
            String(message.message.videoMessage.caption) === "/sticker crop"
          ) {
            crop = true;
          }
          stickerMaker(message, "v", crop).catch((err) => console.log(err)); // v for video or gif
        } else if (
          // To check original message is Image / Gif and the reply for media message is '/sticker'
          message.message.extendedTextMessage &&
          String(message.message.extendedTextMessage.text).startsWith(
            "/sticker"
          ) &&
          (message.message.extendedTextMessage.contextInfo.quotedMessage
            .imageMessage ||
            (message.message.extendedTextMessage.contextInfo.quotedMessage
              .videoMessage &&
              message.message.extendedTextMessage.contextInfo.quotedMessage
                .videoMessage.gifPlayback))
        ) {
          if (
            String(message.message.extendedTextMessage.text) ===
              "/sticker crop" ||
            String(message.message.extendedTextMessage.text) === "/sticker"
          ) {
            var character = "i";
            var crop = false;
            if (
              /*Check if it is the gif if so change argument character to 'v' otherwise it will be default 'i'
            setting it v will enable animation parameter which will result in moving stickers
            */ message.message &&
              message.message.extendedTextMessage &&
              message.message.extendedTextMessage.contextInfo.quotedMessage
                .videoMessage &&
              message.message.extendedTextMessage.contextInfo.quotedMessage
                .videoMessage.gifPlayback
            ) {
              character = "v";
            }
            if (
              message.message &&
              message.message.extendedTextMessage &&
              String(message.message.extendedTextMessage.text) ===
                "/sticker crop"
            ) {
              crop = true;
            }
            await loadMessageLocal(message).then((ogmessage) => {
              console.log(ogmessage);
              if (ogmessage && ogmessage.message) {
                stickerMaker(ogmessage, character, crop);
              }
            });
          }
        }
      }
    });
  }
});
