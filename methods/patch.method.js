const isTheSameObject = require("../helpers/compareObjects.js");

const fs = require("fs/promises");
const path = require("path");

const HeroDataPath = path.join(__dirname, "../DB/HeroData.json");
const VillainDataPath = path.join(__dirname, "../DB/VillianData.json");

const onPatchMethod = async (data, id) => {
  const HeroData = JSON.parse(await fs.readFile(HeroDataPath));
  const VillainData = JSON.parse(await fs.readFile(VillainDataPath));

  const HeroDataById = HeroData.find((hero) => hero.id === id);
  const VillianDataById = VillainData.find((villain) => villain.id === id);

  if (!HeroDataById && !VillianDataById) return null;

  const newCharater = { ...HeroDataById, ...VillianDataById, ...data };
  const isArepeatedCharacter = isTheSameObject(
    newCharater,
    HeroDataById ?? VillianDataById,
  );

  if (isArepeatedCharacter) return null;

  const newDataForWrite = HeroDataById
    ? HeroData.map((hero) => (hero.id === id ? newCharater : hero))
    : VillainData.map((villain) => (villain.id === id ? newCharater : hero));
  fs.writeFile(
    HeroDataById ? HeroDataPath : VillainDataPath,
    JSON.stringify(newDataForWrite),
  );
  return newCharater;
};

module.exports = onPatchMethod;
