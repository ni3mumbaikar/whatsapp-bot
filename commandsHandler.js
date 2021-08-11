import { WAConnection, MessageType, Mimetype } from "@adiwajshing/baileys";
import { connection } from "./wa-connection.js";
import * as WSF from "wa-sticker-formatter";

// Each normal text message starting with '/' will go through this method
export function commandHandler(message) {
  const command = String(message.message.conversation);

  //for static commands with no parameter
  switch (command) {
    case "/help":
      help(message);
      break;
    case "/status":
      status(message);
      break;
    case "/about":
      about(message);
      break;
    default:
      checkcommand(command, message);
  }

  //check normal message command otherwise for dynamic paramaters
  function checkcommand(statement, message) {
    if (String(statement).startsWith("/caps")) {
      //Check weather it is only /caps or it has inputs to it and allow only for input values
      if (!(String(statement).trim() === "/caps")) {
        caps(message);
      }
    }
  }
}

export async function stickerMaker(message, type, crop) {
  const buffer = await connection.downloadMediaMessage(message); // to decrypt & use as a buffer

  var anim = false;
  if (type === "v") {
    anim = true;
  }

  const stickerobj = new WSF.Sticker(buffer, {
    crop: crop,
    animated: anim,
    pack: "hard",
    author: "unknown",
  });
  await stickerobj.build();
  const sticBuffer = await stickerobj.get();
  sticker(message, sticBuffer);
}

async function status(message) {
  await connection.sendMessage(
    message.key.remoteJid,
    "Aye aye captain !",
    MessageType.text
  );
}

export async function loadMessageLocal(message) {
  return connection.loadMessage(
    message.key.remoteJid,
    message.message.extendedTextMessage.contextInfo.stanzaId
  );
}

function help(message) {
  const commands =
    "*AVAILABLE COMMANDS*\n\n" +
    "1. */status* : To check this bot is online or not  🟢 \n\n" +
    "2. */caps your_text* : To return back the text all chars in capital letters  🔼 \n\n" +
    "3. */sticker* : Use /sticker as caption of any image to get it's sticker 🌆\n\n " +
    "4. */about* : To know more about me 💻\n\n" +
    "\n*What's New*\n\n - You can now send /sticker as reply to any image in the group to get it's sticker ◀️\n\n" +
    "- Stickers stretching/squezzing solved use /sticker to get non stretchy full res stickers 😸 use /sticker crop to get cropped version";
  const sentMsg = connection.sendMessage(
    message.key.remoteJid,
    commands,
    MessageType.text
  );
}

async function sticker(message, sticBuffer) {
  connection.sendMessage(
    message.key.remoteJid,
    sticBuffer,
    MessageType.sticker
  );
}

function about(message) {
  const msg =
    "bot by ni3mumbaikar [ https://www.linkedin.com/in/ni3mumbaikar/ ]";
  const sentMsg = connection.sendMessage(
    message.key.remoteJid,
    msg,
    MessageType.text
  );
}

function caps(message) {
  const msg = message.message.conversation.toUpperCase().replace("/CAPS", " ");
  const sentMsg = connection.sendMessage(
    message.key.remoteJid,
    msg.trim(),
    MessageType.text
  );
}
