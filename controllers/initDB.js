const path = require("path");
const { writeFile, readFile } = require("fs/promises");
const SummaryDefault = require("../DB/summarySchema.js");
const changeSummaryData = require("./summaryOnChangeCharacters.js");

const initDB = async () => {
  const charactersDbPath = path.join(__dirname, "../DB/CharactersData.json");
  const summaryDbPath = path.join(__dirname, "../DB/SummaryData.json");
  
  let charactersExist = true;
  let summaryExist = true;

  try {
    const charsDataRaw = await readFile(charactersDbPath, "utf-8");
    const isArray = Array.isArray(JSON.parse(charsDataRaw));
    if (!isArray) {
      console.log("The JSON CharactersData is corrupted, removing it and creating a void new");
      await writeFile(charactersDbPath, "[]");
      charactersExist = false;
    }
  } catch (error) {
    console.log("The DataBase CharactersData does not exists, creating it ...");
    await writeFile(charactersDbPath, "[]");
    charactersExist = false;
  }

  try {
    await readFile(summaryDbPath, "utf-8");
  } catch (error) {
    console.log("The DataBase SummaryData does not exists, creating it ...");
    await writeFile(summaryDbPath, JSON.stringify(SummaryDefault));
    summaryExist = false;
  }

  // If SummaryData didn't exist but CharactersData did, repopulate SummaryData
  if (charactersExist && !summaryExist) {
    const charactersDataRaw = await readFile(charactersDbPath, "utf-8");
    const charactersData = JSON.parse(charactersDataRaw);
    
    // We pass all the characters because changeSummaryData expects an array to reduce
    await changeSummaryData(charactersData);
    console.log("SummaryData populated with existing CharactersData");
  }
};

module.exports = initDB;
