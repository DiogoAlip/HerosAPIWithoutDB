const path = require("path");
const fs = require("fs");

const ExamplesPagePath = path.join(__dirname, "./examples.html");
const ExamplesCssPath = path.join(__dirname, "./examples.css");

const examples = (method, req, res) => {
  const baseURL = `http://${req.headers.host}`;
  const parsedUrl = new URL(req.url, baseURL);
  const pathName = parsedUrl.pathname;

  if (pathName === "/examples.css") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/css; charset=utf-8");
    fs.readFile(ExamplesCssPath, "utf-8", (err, data) => {
      if (err) console.log(err);
      res.end(data);
    });
    return;
  }

  if (pathName === "/examples/api") {
    const apiMethod = req.method;
    const queryParams = Object.fromEntries(parsedUrl.searchParams);

    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      let parsedBody = null;
      if (body) {
        try {
          parsedBody = JSON.parse(body);
        } catch (e) {
          parsedBody = body;
        }
      }

      const targetUrl = parsedBody?._targetUrl || queryParams._targetUrl;
      const targetMethod = parsedBody?._targetMethod || queryParams._targetMethod || apiMethod;

      if (!targetUrl) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Missing _targetUrl" }));
        return;
      }

      try {
        const response = await fetch(targetUrl, {
          method: targetMethod,
          headers: {
            "Content-Type": "application/json",
          },
          body: ["GET", "HEAD"].includes(targetMethod) ? undefined : (parsedBody ? JSON.stringify(parsedBody) : undefined),
        });

        const responseData = await response.text();
        
        res.writeHead(response.status, { "Content-Type": "application/json" });
        res.end(responseData);
      } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
    return;
  }

  if (pathName === "/examples") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    fs.readFile(ExamplesPagePath, "utf-8", (err, data) => {
      if (err) console.log(err);
      res.end(data);
    });
    return;
  }
};

module.exports = examples;
