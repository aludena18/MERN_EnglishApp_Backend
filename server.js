import express from "express";
import Cors from "cors";
import WebSocket, { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
import * as model from "./src/model.js";

const userName = "abel";

//App Config
const app = express();
const port = process.env.PORT || 9000;

//Middleware
app.use(express.json());
app.use(Cors());

//API Endpoints
app.get("/", (req, res) => res.status(200).send("Hello TheWebDev"));

app.get("/sync", (req, res) => {
  res.send(data);
});

app.post("/search", async (req, res) => {
  try {
    const { query } = req.body;
    data = await loadDefinitions(query);
    console.log(data);
  } catch (error) {
    console.log(error.message);
  }
});

// ADD
app.post("/addCard", async (req, res) => {
  const card = req.body;
  const user = await model.getUser(userName);
  model.addCard(user, card);
});
app.post("/addPhrase", async (req, res) => {
  const phrase = req.body;
  const user = await model.getUser(userName);
  model.addPhrase(user, phrase);
});

//DELETE
app.post("/delCard", async (req, res) => {
  const { id } = req.body;
  const user = await model.getUser(userName);
  await model.deleteCard(user, id);
});
app.post("/delPhrase", async (req, res) => {
  const { id } = req.body;
  const user = await model.getUser(userName);
  await model.deletePhrase(user, id);
});

//Listener
const server = app.listen(port, () =>
  console.log(`Listening on localhost: ${port}`)
);
const wsServer = new WebSocketServer({ server });

// Websocket declarations
// I'm maintaining all active connections in this object
const clients = {};

// A new client connection request received
wsServer.on("connection", async function (connection) {
  // Generate a unique code for every user
  const userId = uuidv4();
  console.log(`Recieved a new connection.`);

  // Store the new connection and handle messages
  clients[userId] = connection;
  console.log(`${userId} connected.`);

  // Sending the user's state info
  await model.getUser(userName);
  connection.send(JSON.stringify(model.state));

  // Receiving data from clients
  connection.on("message", async function message(data) {
    try {
      // Receiving the query from the client
      const jsonData = JSON.parse(data.toString());
      //console.log(jsonData);

      if (jsonData.type === "getMeaning") {
        // Fetching the definitions
        await model.loadDefinitions(jsonData.content);

        // Sending the definitions to the client
        connection.send(JSON.stringify(model.state));
      }
    } catch (error) {
      //console.log("Server - error: ", error.message);
      connection.send(JSON.stringify(model.state));
    }
  });
});
