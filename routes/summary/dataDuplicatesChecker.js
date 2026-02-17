const fs = require("fs/promises");
const path = require("path");

const heroDataPath = path.join(__dirname, "../../DB/HeroData.json");
const villianDataPath = path.join(__dirname, "../../DB/VillianData.json");

const dataDuplicatesChecker = async (data) => {
  try {
    const characters =
      data.type == "hero"
        ? await fs.readFile(heroDataPath, "utf-8")
        : await fs.readFile(villianDataPath, "utf-8");
    const findInArray =
      characters &&
      Object.entries(JSON.parse(characters)).filter(
        ([key, value]) =>
          (key == "name" && value == data.name) ||
          (key == "alias" && value == data.alias) ||
          (key == "image" && value == data.image),
      ).length;
    return !!findInArray;
  } catch (error) {
    return error;
  }
};

module.exports = dataDuplicatesChecker;
