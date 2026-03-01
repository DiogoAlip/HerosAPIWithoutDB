const avoidDuplicatesOnPutMethod = async (dataToCheck, baseCharacters) =>
  baseCharacters.map(
    (character) =>
      dataToCheck.find(
        (d) => d.id === character.id && d.type === character.type,
      ) ?? character,
  );

module.exports = avoidDuplicatesOnPutMethod;
