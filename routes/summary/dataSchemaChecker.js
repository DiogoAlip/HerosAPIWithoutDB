const { type } = require("node:os");
const { character } = require("../../DB/heroSchema.js");

const dataSchemaCheker = (data) => {
  if (typeof data === "[object Object]") {
    return `Data Must be an Object and we recived ${data}`;
  }

  const heroKeys = Object.keys(character);

  const confirmation = Object.entries(data).map(([key, value]) => {
    const isAHeroKeyValue = heroKeys.includes(key);
    const isTheTypeOfValue = isAHeroKeyValue
      ? typeof value == character[key]
      : `The field "${key}" not exist in character schema`;
    return [
      key,
      typeof isTheTypeOfValue == "boolean"
        ? !isTheTypeOfValue &&
          `The value type for the field "${key}" is "${character[key]}" and we recived the type "${typeof value}": "${value}"`
        : isTheTypeOfValue,
    ];
  });

  const confirmationValues = confirmation.map(([key, _]) => key);
  const isAllHeroKeys = heroKeys
    .filter((key) => !confirmationValues.includes(key))
    .map((key) => `The field "${key}" is missing`);

  const errMessage = confirmation
    .filter(([_, value]) => {
      if (typeof value === "string") {
        return value;
      }
    })
    .map((value) => {
      return value[1];
    });

  if (errMessage.length > 0 || isAllHeroKeys.length > 0) {
    return errMessage.concat(isAllHeroKeys).join("\n");
  } else {
    const isValidType =
      data["type"] === "hero" ||
      data["type"] === "villain" ||
      `We only accept "hero" or "villain" in the field "type" `;
    const isValidPublisher =
      data["publisher"] === "Marvel" ||
      data["publisher"] === "DC" ||
      `We only accept "Marvel" or "DC" for the field "pulisher" `;
    const forValidDate = new Date(data["dateAparition"]);
    const isValidDate =
      (forValidDate instanceof Date && !isNaN(forValidDate)) ||
      `"${data["dateAparition"]}" is a invalid data for the field "dateAparition", try yyyy-mm-dd`;

    const isValid = [isValidDate, isValidPublisher, isValidType].filter(
      (validator) => typeof validator === "string",
    );
    return isValid.length == 0 ? true : isValid.join("\n");
  }
};
module.exports = dataSchemaCheker;
