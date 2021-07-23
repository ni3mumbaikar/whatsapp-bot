import { WhitelistEntry } from "./db-whitelist_model.js";
import mongoose from "mongoose";

export function connectToDatabase() {
  mongoose.connect(
    "mongodb://localhost:27017/wa-bot",
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

//TODO : Restricted Access is not allowed here
export function entryExists(num) {
  return new Promise((resolve, reject) => {
    WhitelistEntry.find({ number: num }, function (err, docs) {
      if (err) {
        reject(err);
      } else {
        resolve(docs);
      }
    });
    // const newEntry = new WhitelistEntry();
  });
}
