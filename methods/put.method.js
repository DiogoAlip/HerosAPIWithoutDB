const fs = require("fs/promises");
const path = require("path");

const dataSchemaCheker = require("../helpers/dataSchemaChecker");
const replaceData = require("../helpers/replaceData.js");
const findDuplicatesInData = require("../helpers/findDuplicatesInData.js");

const heroDataPath = path.join(__dirname, "../DB/HeroData.json");
const villainDataPath = path.join(__dirname, "../DB/VillianData.json");
const PutFailedPath = path.join(__dirname, "../routes/summary/PutFailed.html");

const onPutMethod = async (res, data) => {
  const PutFailedPage = await fs.readFile(PutFailedPath);
  const isIncludeId = data.filter((dat) => !dat["id"]);

  if (!!isIncludeId.length) {
    res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
    res.end(
      JSON.stringify([
        {
          error: "The next data types are not providing an 'id' field",
          message: "For the put Method is necesary provide an 'id' ",
        },
        ...isIncludeId,
      ]),
    );
    return;
  }

  const check = data.map((dat) => {
    const { id, ...datWithoutId } = dat;
    return dataSchemaCheker(datWithoutId);
  });

  if (check.some((checkItem) => typeof checkItem === "string")) {
    res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
    res.end(check.join("\n"));
    return;
  }

  try {
    const isItDataForHero = data.some((dat) => dat.type == "hero");
    const isItDataForVillain = data.some((dat) => dat.type == "villain");

    if (isItDataForHero) {
      const heroParsedData = JSON.parse(await fs.readFile(heroDataPath));
      const newHeroData = await replaceData(data, heroParsedData);
      const { isDuplicates } = findDuplicatesInData(newHeroData);
      if (
        JSON.stringify(heroParsedData) === JSON.stringify(newHeroData) ||
        isDuplicates.includes(true)
      ) {
        res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
        res.end(PutFailedPage);
        return;
      }

      console.log(newHeroData);
      const heroForWrite = JSON.stringify(newHeroData);
      fs.writeFile(heroDataPath, heroForWrite);
      res.writeHead(201, { "Content-Type": "application/json; charset=utf-8" });
      res.end(heroForWrite);
    }

    if (isItDataForVillain) {
      const villainParsedData = JSON.parse(await fs.readFile(villainDataPath));
      const newVillainData = await replaceData(data, villainParsedData);
      const { isDuplicates } = findDuplicatesInData(newVillainData);
      if (
        JSON.stringify(villainParsedData) === JSON.stringify(newVillainData) ||
        isDuplicates.includes(true)
      ) {
        res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
        res.end(PutFailedPage);
        return;
      }
      const villainForWrite = JSON.stringify(newVillainData);
      fs.writeFile(villainDataPath, villainForWrite);
      res.writeHead(201, { "Content-Type": "application/json; charset=utf-8" });
      res.end(villainForWrite);
    }

    return;
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = onPutMethod;
