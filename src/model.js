import mongoose from "mongoose";
import { getJSON } from "./helpers.js";
import { v4 as uuidv4 } from "uuid";
import {
  API_URL,
  DEF_TYPE,
  USR_TYPE,
  ERR_TYPE,
  DB_LOCAL_URL,
  DB_CLOUD_URL,
  DB_NAME,
  User,
  Card,
  Phrase,
} from "./config.js";

//DB Config
mongoose.set("strictQuery", false);
mongoose.connect(`${DB_CLOUD_URL}/${DB_NAME}`);

export const state = {
  type: "",
  content: [],
};

export const loadDefinitions = async function (query) {
  try {
    const defs = await getJSON(`${API_URL}${query}`);
    updateState(DEF_TYPE, defs);
    return state;
  } catch (error) {
    updateState(ERR_TYPE, [{ message: error.message }]);
    throw error;
  }
};

export const loadUserInfo = async function () {
  try {
  } catch (error) {
    throw error;
  }
};

const updateState = function (type, data) {
  state.type = type;
  state.content = [...data];
};

export const getUser = async function (userName) {
  try {
    let user = await User.findOne({ userName: userName });
    if (!user) user = createUser("abel");
    updateState(USR_TYPE, [user]);
    return user;
  } catch (error) {
    throw error;
  }
};

export const createUser = function (userName) {
  const newUser = new User({
    idUser: uuidv4(),
    userName: userName,
    cards: [],
    phrases: [],
  });
  newUser.save();
  return newUser;
};

export const addCard = function (user, card) {
  // console.log(card);
  const newCard = createCard(card);
  user.cards.push(newCard);
  user.save();
  // updateState(USR_TYPE, [user]);
};

export const addPhrase = function (user, phrase) {
  const newPhrase = createPhrase(phrase);
  user.phrases.push(newPhrase);
  user.save();
};

export const deleteCard = async function (user, id) {
  const card = user.cards.filter((card) => card.idCard === id);
  const _id = card[0]._id;
  // await Card.findByIdAndRemove({ _id: card[0]._id });
  await User.findOneAndUpdate(
    { userName: user.userName },
    { $pull: { cards: { _id: _id } } }
  );
};

export const deletePhrase = async function (user, id) {
  const phrase = user.phrases.filter((phrase) => phrase.idPhrase === id);
  const _id = phrase[0]._id;
  await User.findOneAndUpdate(
    { userName: user.userName },
    { $pull: { phrases: { _id: _id } } }
  );
};

const createCard = function (card) {
  const newCard = new Card(card);
  // newCard.save();
  return newCard;
};

const createPhrase = function (phrase) {
  const newPhrase = new Phrase(phrase);
  // newPhrase.save();
  return newPhrase;
};
