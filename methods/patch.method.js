const isTheSameObject = require("../helpers/compareObjects.js");

const fs = require("fs/promises");
const path = require("path");
const changeSummaryData = require("../controllers/summaryOnChangeCharacters.js");

const CharactersDataPath = path.join(__dirname, "../DB/CharactersData.json");

const onPatchMethod = async (data, id) => {
  const CharactersData = JSON.parse(await fs.readFile(CharactersDataPath));

  const CharacterDataById = CharactersData.find(
    (character) => character.id === id,
  );

  if (!CharacterDataById) return null;

  const newCharacter = { ...CharacterDataById, ...data };
  const isArepeatedCharacter = isTheSameObject(newCharacter, CharacterDataById);

  if (isArepeatedCharacter) return null;

  const newDataForWrite = CharactersData.map((character) =>
    character.id === id ? newCharacter : character,
  );
  if (
    newCharacter.type !== CharacterDataById.type ||
    newCharacter.publisher !== CharacterDataById.publisher
  ) {
    await changeSummaryData([
      newCharacter,
      { ...CharacterDataById, count: -1 },
    ]);
  }
  fs.writeFile(CharactersDataPath, JSON.stringify(newDataForWrite));
  return newCharacter;
};

module.exports = onPatchMethod;
