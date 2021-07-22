import { WAConnection, MessageType, Mimetype } from "@adiwajshing/baileys";
import * as fs from "fs";
import { resolve } from "path";
export var connection = null;
const path = "./auth_info.json";

export async function connectToWhatsApp() {
  try {
    connection = new WAConnection();
    if (fs.existsSync(path)) {
      connection.loadAuthInfo("./auth_info.json");
      await connection.connect();
    } else {
      // this will be called as soon as the credentials are updated
      connection.on("open", () => {
        // save credentials whenever updated
        console.log(`credentials updated!`);
        const authInfo = connection.base64EncodedAuthInfo(); // get all the auth info we need to restore this session
        fs.writeFileSync(
          "./auth_info.json",
          JSON.stringify(authInfo, null, "\t")
        ); // save this info to a file
      });
      await connection.connect();
    }
  } catch (err) {
    console.error(err);
  }
}
