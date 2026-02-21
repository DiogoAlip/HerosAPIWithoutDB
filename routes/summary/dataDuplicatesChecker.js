const fs = require("fs/promises");
const path = require("path");

const heroDataPath = path.join(__dirname, "../../DB/HeroData.json");
const villianDataPath = path.join(__dirname, "../../DB/VillianData.json");

const dataDuplicatesChecker = async (data) => {
  try {
    const herosData = JSON.parse(await fs.readFile(heroDataPath, "utf-8"));
    const villianData = JSON.parse(await fs.readFile(villianDataPath, "utf-8"));

    const validator = data.map((item) => {
      const repitedHeros = herosData.filter(
        (hero) =>
          hero.alias == item.alias ||
          hero.name == item.name ||
          hero.image == item.image,
      );
      const repitedVillains = villianData.filter(
        (villian) =>
          villian.alias == item.alias ||
          villian.name == item.name ||
          villian.image == item.image,
      );
      !!repitedHeros.length && !!repitedVillains.length;
    });

    return validator;
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = dataDuplicatesChecker;
