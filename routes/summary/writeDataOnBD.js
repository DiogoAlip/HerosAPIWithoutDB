const fs = require("fs/promises");
const path = require("path");
const SummaryDataPath = path.join(__dirname, "../../DB/SummaryData.json");
const HeroDataPath = path.join(__dirname, "../../DB/HeroData.json");
const VillianDataPath = path.join(__dirname, "../../DB/VillianData.json");

const writeDataOnBD = (dataForWrite) => {
  if (dataForWrite.type == "hero") {
    fs.appendFile(HeroDataPath, JSON.stringify(dataForWrite));
  } else {
    fs.appendFile(VillianDataPath, JSON.stringify(dataForWrite));
  }
};
module.exports = writeDataOnBD;
