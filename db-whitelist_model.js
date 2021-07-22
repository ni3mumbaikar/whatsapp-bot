import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const Model = mongoose.model;

const schema = new Schema({
  uid: ObjectId,
  number: String,
});

export const WhitelistEntry = new Model("WhiteList", schema);
