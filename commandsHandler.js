import { WAConnection, MessageType, Mimetype } from "@adiwajshing/baileys";
import { connection } from "./wa-connection.js";
import * as WSF from "wa-sticker-formatter";

export function commandHandler(message) {
  console.log("Handler called message " + message);
  const command = String(message.message.conversation);

  //for static commands with no parameter
  switch (command) {
    case "/help":
      help(message);
      break;
    case "/staus":
      status(message);
      break;
    case "/about":
      about(message);
      break;
    default:
      checkcommand(command, message);
  }

  //check command otherwise for dynamic paramaters
  function checkcommand(statement, message) {
    if (String(statement).startsWith("/caps")) {
      if (!(String(statement).trim() === "/caps")) {
        //Check weather it is only /caps or it has inputs allow only for input values
        caps(message);
      }
    }
  }

  console.log(message.message.conversation);
}

export async function stickerMaker(message) {
  const buffer = await connection.downloadMediaMessage(message); // to decrypt & use as a buffer
  console.log("image detected3");
  const stickerobj = new WSF.Sticker(buffer, {
    crop: true,
    animated: false,
    pack: "hard",
    author: "unknown",
  });
  await stickerobj.build();
  const sticBuffer = await stickerobj.get();
  // sticker(message, sticBuffer);
  sticker(message, sticBuffer);
  console.log("inside");

  console.log("outside");
}

async function status(message) {
  console.log("Connection " + connection);
  const sentMsg = await connection.sendMessage(
    message.key.remoteJid,
    "Aye aye captain !",
    MessageType.text
  );
}

function help(message) {
  const commands =
    "  LIST OF AVAILABLE COMMANDS FOR YOU  \n\n" +
    "1. */status* : To check this bot is online or not\n\n" +
    "2. */caps your_text* : To return back the text all chars in capital letters \n\n" +
    "3. */sticker* : Use /sticker as caption of any image to get it's sticker \n\n" +
    "4. */about* : To know more about me\n\n" +
    "*What's New*\nYou can now send /sticker as reply to any image in the group to get it's sticker";
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
