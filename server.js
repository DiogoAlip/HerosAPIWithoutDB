const http = require("http");
const { serverFunc } = require("./app.js");
const initDB = require("./DB/initDB.js");

const port = process.env.PORT ?? 8080;

const server = http.createServer(serverFunc);

async function start() {
  try {
    await initDB();

    server.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });
  } catch (error) {
    console.log("Error al iniciar la BD");
    process.exit(1);
  }
}

start();
