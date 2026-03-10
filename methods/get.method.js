const { readFile } = require("fs/promises");
const path = require("path");

const onGetMethodSummary = async (res) => {
  try {
    const summaryPath = path.join(__dirname, "../DB/SummaryData.json");
    const summaryData = await readFile(summaryPath);
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(summaryData);
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`<h1>Iternal Server Error</h1><p>${error.message}</p>`);
  }
  return;
};
const onGetMethodCharacter = async (res, query) => {
  const { id, type, publisher } = query;

  try {
    const CharactersDataPath = path.join(
      __dirname,
      "../DB/CharactersData.json",
    );
    const CharactersData = JSON.parse(await readFile(CharactersDataPath));

    if (!id && !type && !publisher) {
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify(CharactersData));
      return;
    } else if (id && !type && !publisher) {
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(
        JSON.stringify(CharactersData.find((character) => character.id === id)),
      );
      return;
    } else if (!id && (type || publisher)) {
      const FilteredCharactersData =
        type && publisher
          ? CharactersData.filter(
              (character) =>
                character.type === type && character.publisher === publisher,
            )
          : CharactersData.filter((character) =>
              type
                ? character.type === type
                : character.publisher === publisher,
            );
      res.writeHead(200, { "Content-Type": "application/json; charset=uft-8" });
      res.end(JSON.stringify(FilteredCharactersData));
    } else {
      res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
      res.end(
        JSON.stringify({
          statusCode: 400,
          message:
            "The fields 'type' and 'publisher' are invalid with the field 'id' ",
        }),
      );
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`<h1>Iternal Server Error</h1><p>${error.message}</p>`);
  }
};

module.exports = { onGetMethodCharacter, onGetMethodSummary };
