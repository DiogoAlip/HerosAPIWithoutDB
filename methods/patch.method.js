const isTheSameObject = require("../helpers/compareObjects.js");

const fs = require("fs/promises");
const path = require("path");

const CharactersDataPath = path.join(__dirname, "../DB/CharactersData.json");

const onPatchMethod = async (data, id) => {
  const CharactersData = JSON.parse(await fs.readFile(CharactersDataPath));

  const CharacterDataById = CharactersData.find(
    (character) => character.id === id,
  );

  if (!CharacterDataById) return null;

  const newCharater = { ...CharacterDataById, ...data };
  const isArepeatedCharacter = isTheSameObject(newCharater, CharacterDataById);

  if (isArepeatedCharacter) return null;

  const newDataForWrite = CharactersData.map((character) =>
    character.id === id ? newCharater : character,
  );
  fs.writeFile(CharactersDataPath, JSON.stringify(newDataForWrite));
  return newCharater;
};

module.exports = onPatchMethod;
