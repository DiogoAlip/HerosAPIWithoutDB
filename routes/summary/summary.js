const PostMethod = require("../../methods/post.method.js");
const PutMethod = require("../../methods/put.method.js");
const PatchMethod = require("../../methods/patch.method.js");
const DeleteMethod = require("../../methods/delete.method.js");
const { onGetMethodSummary } = require("../../methods/get.method.js");

const summary = async (method, req, res) => {
  const baseURL = `http://${req.headers.host}`;
  const parsedUrl = new URL(req.url, baseURL);

  const queryId = parsedUrl.searchParams.get("id");

  switch (method) {
    case "GET":
      onGetMethodSummary(res);
      break;

    case "POST":
      let bodyFromPost = "";

      req.on("data", (chunk) => {
        bodyFromPost += chunk.toString();
      });

      req.on("end", () => {
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

      req.on("end", () => {
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

      if (!queryId.length) {
        req.on("end", () => {
          res.writeHead(400, { "Content-Type": "text/html; charset=uft-8" });
          res.end("The query 'id' did not was provided");
        });
        return;
      }

      req.on("end", async () => {
        const data = JSON.parse(bodyFromPatch);

        if (Array.isArray(data)) {
          res.writeHead(400, {
            "Content-Type": "text/html; charset=utf-8",
          });
          res.end("The body is an Array, the type must be an Object");
          return;
        }

        const dataWrited = await PatchMethod(data, queryId);
        if (!dataWrited) {
          res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
          res.end(
            "The character with that 'id' does not exist or the body dont add a diferent value",
          );
          return;
        }

        res.writeHead(201, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.end(JSON.stringify(dataWrited));
      });

      break;
    case "DELETE":
      if (!queryId.length) {
        req.on("end", () => {
          res.writeHead(400, { "Content-Type": "text/html; charset=uft-8" });
          res.end("The query 'id' did not was provided");
        });
        return;
      }

      const DeletedCharacter = await DeleteMethod(queryId);

      if (!DeletedCharacter) {
        res.writeHead(404, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.end(
          JSON.stringify({
            status: "404",
            message: "The 'id' did not match with any data",
          }),
        );
        return;
      }

      res.writeHead(201, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify(DeletedCharacter));

      break;
    default:
      res.statusCode = 405;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end("<h1>This Method is Not Accesible</h1>");
  }
};
module.exports = summary;
