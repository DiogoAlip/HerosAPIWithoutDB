const PostMethod = require("../../methods/post.method.js");
const PutMethod = require("../../methods/put.method.js");
const PatchMethod = require("../../methods/patch.method.js");
const DeleteMethod = require("../../methods/delete.method.js");
const { onGetMethodCharacter } = require("../../methods/get.method.js");

const characters = async (method, req, res) => {
  const baseURL = `http://${req.headers.host}`;
  const parseUrl = new URL(req.url, baseURL);

  const queryId = parseUrl.searchParams.get("id");
  const queryType = parseUrl.searchParams.get("type");
  const queryPublisher = parseUrl.searchParams.get("publisher");

  switch (method) {
    case "GET":
      onGetMethodCharacter(res, {
        id: queryId,
        type: queryType,
        publisher: queryPublisher,
      });
      break;

    case "POST":
      let bodyFromPost = "";

      req.on("data", (chunk) => {
        bodyFromPost += chunk.toString();
      });

      req.on("end", () => {
        if (!bodyFromPost.length) {
          res.writeHead(400, {
            "Content-Type": "application/json; charset=utf-8",
          });
          res.end(
            JSON.stringify({ errorMessage: "The body did not was provided" }),
          );
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
          res.writeHead(400, {
            "Content-Type": "application/json; charset=utf-8",
          });
          res.end(
            JSON.stringify({ errorMessage: "The body did not was provided" }),
          );
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

      if (!queryId) {
        req.on("end", () => {
          res.writeHead(400, {
            "Content-Type": "application/json; charset=utf-8",
          });
          res.end(
            JSON.stringify({
              errorMessage: "The query 'id' did not was provided",
            }),
          );
        });
        return;
      }

      req.on("end", async () => {
        const data = JSON.parse(bodyFromPatch);

        if (Array.isArray(data)) {
          res.writeHead(400, {
            "Content-Type": "application/json; charset=utf-8",
          });
          res.end(
            JSON.stringify({
              errorMessage: "The body is an Array, the type must be an Object",
            }),
          );
          return;
        }

        const dataWrited = await PatchMethod(data, queryId);
        if (!dataWrited) {
          res.writeHead(400, {
            "Content-Type": "application/json; charset=utf-8",
          });
          res.end(
            JSON.stringify({
              errorMessage:
                "The character with that 'id' does not exist or the body dont add a diferent value",
            }),
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
      if (!queryId) {
        req.on("end", () => {
          res.writeHead(400, {
            "Content-Type": "application/json; charset=utf-8",
          });
          res.end(
            JSON.stringify({
              errorMessage: "The query 'id' did not was provided",
            }),
          );
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
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ errorMessage: "This Method is Not Accesible" }));
  }
};

module.exports = characters;
