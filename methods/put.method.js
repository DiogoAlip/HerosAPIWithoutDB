const fs = require("fs/promises");
const path = require("path");
const dataSchemaCheker = require("../helpers/dataSchemaChecker");
const dataDuplicatesChecker = require("../helpers/dataDuplicatesChecker");
const heroDataPath = path.join(__dirname, "../DB/HeroData.json");
const villainDataPath = path.join(__dirname, "../DB/VillianData.json");

const onPutMethod = async (res, data) => {
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
      const newHeroData = heroParsedData.map(
        (hero) =>
          data.find((d) => d.id == hero.id && d.name == hero.name) ?? hero,
      );

      if (JSON.stringify(heroJSONData) == JSON.stringify(newHeroData)) {
        res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
        res.end(
          "The 'id' or 'name' does not coincide with the data, try to check the 'id' or 'name' using GET on /heroes or /villain",
        );
        return;
      }

      const heroForWrite = JSON.stringify(newHeroData);
      fs.writeFile(heroDataPath, heroForWrite);
      res.writeHead(201, { "Content-Type": "application/json; charset=utf-8" });
      res.end(heroForWrite);
    }

    if (isItDataForVillain) {
      const villainParsedData = JSON.parse(await fs.readFile(villainDataPath));
      const newVillainData = villainParsedData.map(
        (villain) =>
          data.find((d) => d.id == villain.id && d.name == villain.name) ??
          villain,
      );

      if (JSON.stringify(villainParsedData) == JSON.stringify(newVillainData)) {
        res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
        res.end(
          "The 'id' or 'name' does not coincide with the data, try to check the 'id' or 'name' using GET on /heroes or /villain",
        );
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
