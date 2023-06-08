const { MongoClient } = require("mongodb");

const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https")
      res.redirect(`https://${req.header("host")}${req.url}`);
    else next();
  });
}
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

server.listen(port, () => console.log("app is running " + port));

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));

let newGlobal;
let serverHS;
let Pname;
let result1;

let players = {};

io.on("connection", connected);

function connected(socket) {
  socket.on("startGame", () => {
    socket.emit("gameStarted");
    socket.on("newPlayer", data => {
      // console.log("New client connected, with id: " + socket.id);
      players[socket.id] = data;
      // console.log("Current number of players: " + Object.keys(players).length);
      // console.log("players dictionary: ", players);
    });
    socket.on("update", data => {
      players[socket.id] = data;
      io.emit("updatePlayers", players);
    });
    socket.on("projFired", data => {
      socket.broadcast.emit("projDirection", data);
    });
    // socket.on("projSpliced", data => {
    //   socket.broadcast.emit("spliceProj", data);
    // });
    socket.on("shrunk", data => {
      socket.broadcast.emit("shrinkPlayer", data.playerId);
    });
    socket.on("fatter", data => {
      socket.broadcast.emit("bigPlayer", data);
    });
    socket.on("endGame", data => {
      socket.broadcast.emit("stopAnim", data.playerId);
    });
    socket.on("disconnect", function () {
      delete players[socket.id];
      console.log("Goodbye client with id " + socket.id);
      console.log("Current number of players: " + Object.keys(players).length);
      io.emit("updatePlayers", players);
    });
  });
}

async function main() {
  const uri =
    "mongodb+srv://RAW:love4papa@highscoredb.0bl2k.mongodb.net/highScoreDB?retryWrites=true&w=majority";

  /**
   * In case: '[MONGODB DRIVER] Warning: Current Server Discovery and Monitoring engine is deprecated...'
   * pass option { useUnifiedTopology: true } to the MongoClient constructor.
   * const client =  new MongoClient(uri, {useUnifiedTopology: true})
   */

  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Find the listing named "Infinite Views" that we created in create.js
    await findOneListingByNameWithoutLog(client, "HS");

    app.post("/", (req, res) => {
      findOneListingByNameWithoutLog(client, "HS");
      newGlobal = result1.score;
      serverHS = req.body.playerCurrentScore;
      Pname = result1.globalName;

      const serverINT = parseInt(serverHS);
      const newGlobalInt = parseInt(newGlobal);

      if (serverINT >= newGlobalInt) {
        newGlobal = serverHS;
        Pname = req.body.storedName;
        updateListingByName(client, "HS", {
          score: newGlobal,
          globalName: Pname,
        });
      } else {
      }
    });

    app.get("/", (req, res) => {
      res.render("index", {
        text: newGlobal,
        playerName: Pname,
      });
    });
  } catch (e) {
    console.error(e);
  } finally {
  }
}

main().catch(console.error);

async function updateListingByName(client, nameOfListing, updatedListing) {
  const result = await client
    .db("scoreData")
    .collection("scoreCollect")
    .updateOne({ name: nameOfListing }, { $set: updatedListing });

  console.log(`${result.matchedCount} document(s) matched the query criteria.`);
  console.log(`${result.modifiedCount} document(s) was/were updated.`);
}

async function findOneListingByNameWithoutLog(client, nameOfListing) {
  result1 = await client
    .db("scoreData")
    .collection("scoreCollect")
    .findOne({ name: nameOfListing });
}
