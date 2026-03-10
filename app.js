const path = require("path");
const fs = require("fs");
const summary = require("./routes/summary/summary");
const heroes = require("./routes/heroes/heroes");

const NotFoundPagePath = path.join(
  __dirname,
  "./routes/not-found/NotFound.html",
);
const HomePagePath = path.join(__dirname, "./routes/root/HomePage.html");

const serverApp = (req, res) => {
  const { method, url } = req;

  const baseURL = `http://${req.headers.host}`;
  const parsedUrl = new URL(url, baseURL);

  const pathName = parsedUrl.pathname;

  console.log(`${method}(${typeof method}) on ${pathName} (${typeof url})`);
  switch (pathName) {
    case "/":
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      fs.readFile(HomePagePath, "utf-8", (err, data) => {
        if (err) {
          console.log(err);
        }
        res.end(data);
      });
      break;
    case "/summary":
      summary(method, req, res);
      break;
    case "/villains":
      break;
    case "/heros":
      heroes(method, req, res);
      break;
    default:
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      fs.readFile(NotFoundPagePath, "utf-8", (err, data) => {
        if (err) {
          console.log(err);
        }
        res.end(data);
      });
      return;
  }
};

module.exports = {
  serverFunc: serverApp,
};
