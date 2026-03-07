const dataDuplicatesChecker = require("../helpers/dataDuplicatesChecker");
const dataSchemaCheker = require("../helpers/dataSchemaChecker");
const writeNewDataOnBD = require("../controllers/writeNewDataOnBD.js");

const onPostMethod = async (res, data) => {
  const check = data.map((dat) => dataSchemaCheker(dat));

  if (check.some((checkItem) => typeof checkItem === "string")) {
    res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
    res.end(check.join("\n"));
    return;
  }

  const itAlreadyExists = await dataDuplicatesChecker(data);
  if (itAlreadyExists.every((item) => item === true)) {
    res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
    res.end("The charater(s) already exist");
    return;
  }

  if (itAlreadyExists.includes(true)) {
    const RepeatedDataIndexes = itAlreadyExists
      .map((item, index) => (item === true ? index : null))
      .filter((item) => item != null);
    const UnRepeatedData = data.filter(
      (_, index) => !RepeatedDataIndexes.includes(index),
    );
    const dataWithId = await writeNewDataOnBD(UnRepeatedData);
    res.writeHead(201, {
      "Content-Type": "application/json; charset=utf-8",
    });
    res.end(JSON.stringify(dataWithId));
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
