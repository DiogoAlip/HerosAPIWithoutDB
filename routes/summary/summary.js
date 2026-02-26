const PostMethod = require("../../methods/post.method.js");
const PutMethod = require("../../methods/put.method.js");
const { onGetMethodSummary } = require("../../methods/get.method.js");
const { stringify } = require("querystring");

const summary = (method, req, res) => {
  const baseURL = `http://${req.headers.host}`;
  const parsedUrl = new URL(req.url, baseURL);

  const queryId = stringify(parsedUrl.searchParams.get("id"));

  switch (method) {
    case "GET":
      onGetMethodSummary(res);
      break;

    case "POST":
      let bodyFromPost = "";

      req.on("data", (chunk) => {
        bodyFromPost += chunk.toString();
      });


      req.on("end", async () => {
        if (!bodyFromPost.length) {
          res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
          res.end("The body did not was provided");
        }
        const data = JSON.parse(bodyFromPost);
        const dataArray = Array.isArray(data) ? data : [data];
        PostMethod(res, dataArray);
      });
      break;
    case "PUT":
      let bodyFromPut = "";

      req.on("data", (chunk) => {
        bodyFromPut += chunk.toString();
      });

      req.on("end", async () => {
        if (!bodyFromPut.length) {
          res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
          res.end("The body did not was provided");
        }
        const data = JSON.parse(bodyFromPut);
        const dataArray = Array.isArray(data) ? data : [data];
        PutMethod(res, dataArray);
      });
      break;
    case "PATCH":
      let bodyFromPatch = "";

      req.on("data", (chunk) => {
        bodyFromPatch += chunk.toString();
      });

      if (queryId) {
        req.on("end", () => {
          res.writeHead(400, { "Content-Type": "text/html; charset=uft-8" });
          res.end("The query 'id' did not was provided");
        });
      } else {
        req.on("end", () => {
          res.writeHead(201, {
            "Content-Type": "application/json; charset=utf-8",
          });
          res.end(JSON.stringify());
        });
      }

      break;
    case "DELETE":
    default:
      res.statusCode = 405;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end("<h1>This Method is Not Accesible</h1>");
  }
};
module.exports = summary;
