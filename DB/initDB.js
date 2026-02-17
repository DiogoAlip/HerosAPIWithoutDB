const path = require("path");
const { writeFile, readFile } = require("fs/promises");

const initDB = async () => {
  const principalDBs = ["HeroData", "VillianData", "SummaryData"];

  for (const db of principalDBs) {
    const dbPath = path.join(__dirname, `${db}.json`);
    try {
      const isDb = await readFile(dbPath, "utf-8");
      const isArray = Array.isArray(JSON.parse(isDb));
      if (!isArray) {
        console.log(
          `The JSON ${db} is corrupted, removing it and creating a void new`,
        );
        await writeFile(dbPath, "[]");
      }
    } catch (error) {
      console.log(`The DataBase ${db} does not exists, creating it ...`);
      await writeFile(dbPath, "[]");
    }
  }
};

module.exports = initDB;
