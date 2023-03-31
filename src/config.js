import * as dotenv from "dotenv";
dotenv.config();
import mongoose, { Schema } from "mongoose";

export const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";
export const DB_LOCAL_URL = "mongodb://127.0.0.1:27017";
export const DB_CLOUD_URL = `mongodb+srv://${process.env.ENV_DB_USER}:${process.env.ENV_DB_PASS}@cluster0.atijvsm.mongodb.net`;
//export const DB_CLOUD_URL = `mongodb+srv://abel-admin:200211420@cluster0.atijvsm.mongodb.net`;
export const DB_NAME = "englishAppDb";
export const TIMEOUT_FETCH_SEC = 5;

export const DEF_TYPE = "defRes";
export const USR_TYPE = "usrRes";
export const PHR_TYPE = "phrRes";
export const ERR_TYPE = "errRes";

// DB Schemas
export const card = new Schema({
  idCard: String,
  word: String,
  partOfSpeech: String,
  definition: String,
  example: String,
});

export const phrase = new Schema({
  idPhrase: String,
  phrase: String,
  meaning: String,
});

export const user = new Schema({
  idUser: String,
  userName: String,
  cards: [card],
  phrases: [phrase],
});

// DB Models
export const User = mongoose.model("User", user);
export const Card = mongoose.model("Card", card);
export const Phrase = mongoose.model("Phrase", phrase);
