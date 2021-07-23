import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const Model = mongoose.model;

const schema = new Schema(
  {
    uid: { type: ObjectId },
    number: { type: String },
  },
  {
    collection: "whitelist",
  }
);

export const WhitelistEntry = new Model("whitelist", schema);
