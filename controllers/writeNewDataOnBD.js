const fs = require("fs/promises");
const path = require("path");
const summaryOnChangeCharacters = require("./summaryOnChangeCharacters.js");

const SummaryDataPath = path.join(__dirname, "../DB/SummaryData.json");
const CharacterDataPath = path.join(__dirname, "../DB/CharactersData.json");

const writeNewDataOnBD = async (dataForWrite) => {
  try {
    const SummaryData = JSON.parse(await fs.readFile(SummaryDataPath, "utf-8"));
    const CharactersData = JSON.parse(
      await fs.readFile(CharacterDataPath, "utf-8"),
    );

    const { MarvelCharacters, DCcharacters } = SummaryData;
    const dataWithID = dataForWrite.map((data, index) => ({
      id:
        data.publisher == "Marvel"
          ? `Marvel-${MarvelCharacters + index + 1}`
          : `DC-${DCcharacters + index + 1}`,
      ...data,
    }));

    summaryOnChangeCharacters(dataWithID);
    await fs.writeFile(
      CharacterDataPath,
      JSON.stringify([...CharactersData, ...dataWithID]),
    );

    return dataWithID;
  } catch (error) {
    return error;
  }
};
module.exports = writeNewDataOnBD;
