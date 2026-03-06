const fs = require("fs/promises");
const path = require("path");

const CharactersDataPath = path.join(__dirname, "../DB/CharactersData.json");

const dataDuplicatesChecker = async (data) => {
  try {
    const CharactersData = JSON.parse(
      await fs.readFile(CharactersDataPath, "utf-8"),
    );

    const validators = data.map((item) => {
      const repitedCharacters = CharactersData.filter(
        (character) =>
          character.alias === item.alias ||
          character.name === item.alias ||
          character.image === item.image,
      );
      return !!repitedCharacters;
    });
    return validators;
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = dataDuplicatesChecker;
