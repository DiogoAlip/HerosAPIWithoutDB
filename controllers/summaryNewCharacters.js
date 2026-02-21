const fs = require("fs/promises");
const path = require("path");

const SummaryDataPath = path.join(__dirname, "../DB/SummaryData.json");

const summaryNewCharacters = async (charactersArray) => {
  const SummaryData = JSON.parse(await fs.readFile(SummaryDataPath, "utf-8"));

  const {
    MarvelCharacters,
    DCcharacters,
    MarvelVillains,
    DCvillains,
    MarvelHeroes,
    DCheroes,
    TotalHeroes,
    TotalVillains,
    TotalCharacters,
  } = SummaryData;

  const newSummary = charactersArray.reduce(
    (acc, character) => {
      const isMarvel = character.publisher === "Marvel";
      const isDC = character.publisher === "DC";
      const isHero = character.type === "hero";
      const isVillain = character.type === "villain";

      if (isMarvel) {
        acc.MarvelCharacters++;
        if (isHero) acc.MarvelHeroes++;
        if (isVillain) acc.MarvelVillains++;
      } else if (isDC) {
        acc.DCcharacters++;
        if (isHero) acc.DCheroes++;
        if (isVillain) acc.DCvillains++;
      }

      if (isHero) acc.TotalHeroes++;
      if (isVillain) acc.TotalVillains++;

      acc.TotalCharacters++;
      return acc;
    },
    {
      MarvelCharacters,
      DCcharacters,
      MarvelVillains,
      DCvillains,
      MarvelHeroes,
      DCheroes,
      TotalHeroes,
      TotalVillains,
      TotalCharacters,
    },
  );

  await fs.writeFile(SummaryDataPath, JSON.stringify(newSummary));

  return newSummary;
};

module.exports = summaryNewCharacters;
