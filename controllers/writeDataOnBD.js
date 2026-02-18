const fs = require("fs/promises");
const path = require("path");
const SummaryDataPath = path.join(__dirname, "../../DB/SummaryData.json");
const HeroDataPath = path.join(__dirname, "../../DB/HeroData.json");
const VillianDataPath = path.join(__dirname, "../../DB/VillianData.json");

const writeDataOnBD = async (dataForWrite) => {
  const dataToArray = Array.isArray(dataForWrite)
    ? dataForWrite
    : [dataForWrite];
  try {
    const SummaryData = JSON.parse(await fs.readFile(SummaryDataPath, "utf-8"));

    const { MarvelCharacters, DCcharacters } = SummaryData;
    const dataWithID = dataToArray.map((data, index) => ({
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

    return dataWithID;
    fs.appendFile(
      dataForWrite.type == "hero" ? HeroDataPath : VillianDataPath,
      JSON.stringify(dataForWrite),
    );
  } catch (error) {
    return error;
  }
};
module.exports = writeDataOnBD;
