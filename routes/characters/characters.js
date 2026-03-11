const { onGetMethodCharacter } = require("../../methods/get.method");

const characters = async (method, req, res) => {
  const baseURL = `http://${req.headers.host}`;
  const parseUrl = new URL(req.url, baseURL);

  const queryId = parseUrl.searchParams.get("id");
  const queryType = parseUrl.searchParams.get("type");
  const queryPublisher = parseUrl.searchParams.get("publisher");

  if (method !== "GET") {
    res.writeHead(405, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h1>The '/heros' route only support the GET method </h1>");
    return;
  }

  onGetMethodCharacter(res, {
    id: queryId,
    type: queryType,
    publisher: queryPublisher,
  });
};

module.exports = characters;
