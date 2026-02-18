const fs = require("fs/promises");
const path = require("path");

const SummaryDataPath = path.join(__dirname, "../../DB/SummaryData.json");

const summaryNewCharacters = async (charactersArray) => {
  const SummaryData = JSON.parse(await fs.readFile(SummaryDataPath, "utf-8"));

  const {
    MarvelCharacters,
    DCcharacters,
    MarvelVillains,
    DCvillains,
    MarvelHeroes,
    DCheroes,
    TotalMarvelCharacters,
    TotalDCcharacters,
    TotalHeroes,
    TotalVillains,
    TotalCharacters,
  } = SummaryData;
};

module.exports = summaryNewCharacters;
