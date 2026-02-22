const dataDuplicatesChecker = require("../helpers/dataDuplicatesChecker");
const dataSchemaCheker = require("../helpers/dataSchemaChecker");
const writeNewDataOnBD = require("../controllers/writeDataOnBD.js");

const onPostMethod = async (res, data) => {
  const check = data.map((dat) => dataSchemaCheker(dat)).join("\n");

  if (check.includes((checkItem) => typeof checkItem === "string")) {
    res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
    res.end(check);
    return;
  }

  const itAlreadyExists = await dataDuplicatesChecker(data);
  if (itAlreadyExists.includes(true)) {
    res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
    res.end("The charater already exist");
    return;
  }

  const dataWithId = await writeNewDataOnBD(data);
  res.writeHead(201, {
    "Content-Type": "application/json; charset=utf-8",
  });
  res.end(JSON.stringify(dataWithId));
  return dataWithId;
};

module.exports = onPostMethod;
