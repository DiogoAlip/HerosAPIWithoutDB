const fs = require("fs/promises");
const path = require("path");
const summaryNewCharacters = require("./summaryNewCharacters.js");

const SummaryDataPath = path.join(__dirname, "../DB/SummaryData.json");
const HeroDataPath = path.join(__dirname, "../DB/HeroData.json");
const VillianDataPath = path.join(__dirname, "../DB/VillianData.json");

const writeDataOnBD = async (dataForWrite) => {
  try {
    const SummaryData = JSON.parse(await fs.readFile(SummaryDataPath, "utf-8"));
    const HeroData = JSON.parse(await fs.readFile(HeroDataPath, "utf-8"));
    const VillianData = JSON.parse(await fs.readFile(VillianDataPath, "utf-8"));

    const { MarvelCharacters, DCcharacters } = SummaryData;
    const dataWithID = dataForWrite.map((data, index) => ({
      id:
        data.publisher == "Marvel"
          ? `Marvel-${MarvelCharacters + index + 1}`
          : `DC-${DCcharacters + index + 1}`,
      ...data,
    }));

    const newVillianData = dataWithID.filter(
      (villian) => villian.type == "villain",
    );
    const newHeroData = dataWithID.filter((hero) => hero.type == "hero");

    summaryNewCharacters(dataWithID);

    if (newHeroData.length > 0) {
      await fs.writeFile(
        HeroDataPath,
        JSON.stringify([...HeroData, ...newHeroData]),
      );
    }

    if (newVillianData.length > 0) {
      await fs.writeFile(
        VillianDataPath,
        JSON.stringify([...VillianData, ...newVillianData]),
      );
    }
    return dataWithID;
  } catch (error) {
    return error;
  }
};
module.exports = writeDataOnBD;
