const fs = require("fs/promises");
const path = require("path");
const changeSummaryData = require("../controllers/summaryOnChangeCharacters");

const CharactersDataPath = path.join(__dirname, "../DB/CharactersData.json");

const onDeleteMethod = async (id) => {
  try {
    const CharactersData = JSON.parse(await fs.readFile(CharactersDataPath));
    const CharacterById = CharactersData.find(
      (character) => character.id === id,
    );

    if (CharacterById) {
      const CharacterDataFiltered = CharactersData.filter(
        (character) => character.id !== id,
      );
      fs.writeFile(CharactersDataPath, JSON.stringify(CharacterDataFiltered));
      await changeSummaryData([{ ...CharacterById, count: -1 }]);
    }

    return CharacterById;
  } catch (error) {
    console.log(error);
  }
};

module.exports = onDeleteMethod;
