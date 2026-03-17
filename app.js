const path = require("path");
const summary = require("./routes/summary/summary");
const characters = require("./routes/characters/characters");
const examples = require("./routes/examples/examples");

const serverApp = (req, res) => {
  const { method, url } = req;

  const baseURL = `http://${req.headers.host}`;
  const parsedUrl = new URL(url, baseURL);

  const pathName = parsedUrl.pathname;

  console.log(`${method}(${typeof method}) on ${pathName} (${typeof url})`);
  switch (pathName) {
    case "/":
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(
        JSON.stringify({
          message:
            "Welcome to Heroes API: If want to use the APi you shoud'nt be here",
          routers: ["/summary", "/villain", "/heroes", "/examples"],
        }),
      );
      break;
    case "/summary":
      summary(method, req, res);
      break;
    case "/characters":
      characters(method, req, res);
      break;
    case "/examples":
    case "/examples.css":
    case "/examples/api":
      examples(method, req, res);
      break;
    default:
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(
        JSON.stringify({
          errorMessage: "Resource not found",
          routes: ["/summary", "/villain", "/heroes", "/examples"],
        }),
      );
      return;
  }
};

module.exports = {
  serverFunc: serverApp,
};
