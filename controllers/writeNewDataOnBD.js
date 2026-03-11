const fs = require("fs/promises");
const path = require("path");
const summaryOnChangeCharacters = require("./summaryOnChangeCharacters.js");

const CharacterDataPath = path.join(__dirname, "../DB/CharactersData.json");

const writeNewDataOnBD = async (dataForWrite) => {
  try {
    const CharactersData = JSON.parse(
      await fs.readFile(CharacterDataPath, "utf-8"),
    );

    const MarvelCharactersID = CharactersData.filter((character) =>
      character.id.contain("Marvel"),
    ).map((character) => character.id);

    const DCCharactersID = CharactersData.filter((character) =>
      character.id.contain("DC"),
    ).map((character) => character.id);

    let MarvelIDsUnused = [];
    let DCIDsUnused = [];

    for (
      let index = 1;
      MarvelIDsUnused.length <= dataForWrite.length ||
      DCIDsUnused.length <= dataForWrite.length;
      index++
    ) {
      const marvelIdToCheck = `Marvel-${index}`;
      const dcIdToCheck = `DC-${index}`;

      const marvelIdExists = MarvelCharactersID.includes(marvelIdToCheck);
      const dcIdExists = DCCharactersID.includes(dcIdToCheck);

      if (!marvelIdExists) {
        MarvelIDsUnused.push(marvelIdToCheck);
      }

      if (!dcIdExists) {
        DCIDsUnused.push(dcIdToCheck);
      }
    }

    const marvelDataWithID = dataForWrite
      .filter((character) => character.publisher === "Marvel")
      .map((data, index) => ({
        id: MarvelIDsUnused[index],
        slug: data.alias.concat(data.name).toLowerCase().replace(/ /g, "-"),
        ...data,
      }));

    const dcDataWithID = dataForWrite
      .filter((character) => character.publisher === "DC")
      .map((data, index) => ({
        id: DCIDsUnused[index],
        slug: data.alias.concat(data.name).toLowerCase().replace(/ /g, "-"),
        ...data,
      }));

    const dataWithID = marvelDataWithID.concat(dcDataWithID);

    summaryOnChangeCharacters(dataWithID);
    await fs.writeFile(
      CharacterDataPath,
      JSON.stringify([...CharactersData, ...dataWithID]),
    );

    return dataWithID;
  } catch (error) {
    return error;
  }
};
module.exports = writeNewDataOnBD;
