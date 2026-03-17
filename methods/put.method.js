const fs = require("fs/promises");
const path = require("path");

const dataSchemaCheker = require("../helpers/dataSchemaChecker");
const replaceData = require("../helpers/replaceData.js");
const findDuplicatesInData = require("../helpers/findDuplicatesInData.js");
const changeSummaryData = require("../controllers/summaryOnChangeCharacters.js");

const CharactersDataPath = path.join(__dirname, "../DB/CharactersData.json");

const onPutMethod = async (res, data) => {
  const isIncludeId = data.filter((dat) => !dat["id"]);

  if (!!isIncludeId.length) {
    res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify([
        {
          error: "The next data types are not providing an 'id' field",
          message: "For the put Method is necesary provide an 'id' ",
        },
        ...isIncludeId,
      ]),
    );
    return;
  }

  const check = data.map((dat) => {
    const { id, ...datWithoutId } = dat;
    return dataSchemaCheker(datWithoutId);
  });

  if (check.some((checkItem) => typeof checkItem === "string")) {
    res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ errorMessage: check.join("\n") }));
    return;
  }

  try {
    const characterParsedData = JSON.parse(
      await fs.readFile(CharactersDataPath),
    );
    const newCharacterData = await replaceData(data, characterParsedData);
    const { isDuplicates } = findDuplicatesInData(newCharacterData);
    if (
      JSON.stringify(characterParsedData) ===
        JSON.stringify(newCharacterData) ||
      isDuplicates.includes(true)
    ) {
      res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
      res.end(
        JSON.stringify({
          errorMessage:
            "The 'image', 'alias' or 'name' repeat with other character; 'id' or 'type' does not coincide with the data; check '/villain or /heroes' ",
        }),
      );
      return;
    }

    const commingData = data.filter((dat) =>
      characterParsedData.find((character) => character.id === dat.id),
    );

    const leavingData = characterParsedData
      .filter((character) => data.find((dat) => dat.id === character.id))
      .map((character) => ({ ...character, count: -1 }));

    const registerNewSummary = commingData.concat(leavingData);
    await changeSummaryData(registerNewSummary);

    const characterForWrite = JSON.stringify(newCharacterData);
    fs.writeFile(CharactersDataPath, characterForWrite);
    res.writeHead(201, { "Content-Type": "application/json; charset=utf-8" });
    res.end(characterForWrite);

    return;
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = onPutMethod;
