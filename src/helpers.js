import fetch from "node-fetch";
import { TIMEOUT_FETCH_SEC } from "./config.js";

export const timeOutFetch = function (time) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(
        new Error(`Resquest took too long!. Time out after ${time} seconds`)
      );
    }, time * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    const res = await Promise.race([
      fetch(url),
      timeOutFetch(TIMEOUT_FETCH_SEC),
    ]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message}`);
    return data;
  } catch (error) {
    // console.log("helpers - error: ", error.message);
    throw error;
  }
};
