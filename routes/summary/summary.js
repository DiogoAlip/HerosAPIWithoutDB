const path = require("path");
const fs = require("fs");
const dataSchemaCheker = require("./dataSchemaChecker.js");

const BDpath = path.join(__dirname, "../../DB/DataBase.json");

const summary = (method, req, res) => {
  switch (method) {
    case "GET":
      fs.readFile(BDpath, "utf-8", (err, data) => {
        if (err) {
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.statusCode = 500;
          res.end("<h1>Iternal Server Error</h1>");
          console.log(err);
        }
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.statusCode = 200;
        res.end(data);
      });
      break;

    case "POST":
      let body = "";

      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        const data = JSON.parse(body);
        const check = Array.isArray(data)
          ? data.map((dat) => dataSchemaCheker(dat)).join("\n")
          : dataSchemaCheker(data);

        if (typeof check === "string") {
          res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
          res.end(check);
          return;
        }

        res.writeHead(201, {
          "Content-Type": "application/json; charset=utf-8",
        });

        res.end(JSON.stringify(data));
      });
      break;
    case "PUT":
    case "PATCH":
    case "DELETE":
    default:
      res.statusCode = 405;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end("<h1>This Method is Not Accesible</h1>");
  }
};
module.exports = summary;
