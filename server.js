const http = require("http");
const { serverFunc } = require("./app.js");

const port = process.env.PORT ?? 8080;

const server = http.createServer(serverFunc);

server.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
