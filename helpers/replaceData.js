const avoidDuplicatesOnPutMethod = async (dataToCheck, baseCharacters) =>
  baseCharacters.map(
    (character) => dataToCheck.find((d) => d.id === character.id) ?? character,
  );

module.exports = avoidDuplicatesOnPutMethod;
