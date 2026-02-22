const path = require("path");
const fs = require("fs");
const PostMethod = require("../../methods/post.method.js");

const BDpath = path.join(__dirname, "../../DB/SummaryData.json");

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

      req.on("end", async () => {
        const data = JSON.parse(body);
        const dataArray = Array.isArray(data) ? data : [data];
        PostMethod(res, dataArray);
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
