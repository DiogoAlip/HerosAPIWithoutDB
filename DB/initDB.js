const path = require("path");
const { writeFile, readFile } = require("fs/promises");

const SummaryDefault = {
  MarvelCharacters: 0,
  DCcharacters: 0,
  MarvelVillains: 0,
  DCvillains: 0,
  MarvelHeroes: 0,
  DCvillains: 0,
  TotalMarvelCharacters: 0,
  TotalDCcharacters: 0,
  TotalHeroes: 0,
  TotalVillains: 0,
  TotalCharacters: 0,
};

const initDB = async () => {
  const principalDBs = ["HeroData", "VillianData", "SummaryData"];

  for (const db of principalDBs) {
    const dbPath = path.join(__dirname, `${db}.json`);
    const dataForWrite =
      db == "SummaryData" ? JSON.stringify(SummaryDefault) : "[]";
    try {
      const isDb = await readFile(dbPath, "utf-8");
      const isArray = Array.isArray(JSON.parse(isDb));
      if (!isArray && db != "SummaryData") {
        console.log(
          `The JSON ${db} is corrupted, removing it and creating a void new`,
        );
        console.log("error is here");
        await writeFile(dbPath, dataForWrite);
      }
    } catch (error) {
      console.log(`The DataBase ${db} does not exists, creating it ...`);
      await writeFile(dbPath, dataForWrite);
    }
  }
};

module.exports = initDB;
