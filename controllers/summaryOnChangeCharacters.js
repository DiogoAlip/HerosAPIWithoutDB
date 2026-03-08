// Interface changes = {
//   publisher: "Marvel" | "DC",
//   type: "hero" | "villain",
//  .count ?? 1: number,
// }[]
// the changes can be character data type

const fs = require("fs/promises");
const path = require("path");

const SummaryDataPath = path.join(__dirname, "../DB/SummaryData.json");

const changeSummaryData = async (changes) => {
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

  const newSummary = changes.reduce(
    (acc, character) => {
      const isMarvel = character.publisher === "Marvel";
      const isDC = character.publisher === "DC";
      const isHero = character.type === "hero";
      const isVillain = character.type === "villain";

      if (isMarvel) {
        acc.MarvelCharacters += character.count ?? 1;
        if (isHero) acc.MarvelHeroes += character.count ?? 1;
        if (isVillain) acc.MarvelVillains += character.count ?? 1;
      } else if (isDC) {
        acc.DCcharacters += character.count ?? 1;
        if (isHero) acc.DCheroes += character.count ?? 1;
        if (isVillain) acc.DCvillains += character.count ?? 1;
      }

      if (isHero) acc.TotalHeroes += character.count ?? 1;
      if (isVillain) acc.TotalVillains += character.count ?? 1;

      acc.TotalCharacters += character.count ?? 1;
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

module.exports = changeSummaryData;
