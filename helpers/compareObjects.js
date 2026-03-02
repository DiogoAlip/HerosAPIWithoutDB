const compareObjects = (object1, object2) => {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    // Check if the key exists in both and the values are strictly equal
    if (!object2.hasOwnProperty(key) || object1[key] !== object2[key]) {
      return false;
    }
  }

  return true;
};

module.exports = compareObjects;
