import { WhitelistEntry } from "./db-whitelist_model.js";
import mongoose from "mongoose";

export function connectToDatabase() {
  mongoose.connect(
    "mongodb://localhost:27017/whitelist",
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
      console.log("Database connected successfully ");
    }
  );
}

export function addUser(number) {
  return new Promise((resolve, reject) => {
    const newEntry = new WhitelistEntry();
    newEntry.number = number;
    newEntry
      .save()
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export async function entryExists(number) {
  // const newEntry = new WhitelistEntry();
  await WhitelistEntry.find({ number: number }, (err, docs) => {
    if (err) {
      console.log("Rejected Promise " + err);
    } else {
      console.log("Resolved " + docs);
    }
  });
}
