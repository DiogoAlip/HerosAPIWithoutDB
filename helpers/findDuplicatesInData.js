const findDuplicatesInArray = (dataArray) => {
  try {
    const duplicates = dataArray.map((dataToCheck, index) =>
      dataArray
        .toSpliced(index, 1)
        .some((dataToCompare) =>
          dataToCompare.type === dataToCheck.type ||
          dataToCompare.publisher === dataToCheck.publisher
            ? false
            : dataToCompare.alias === dataToCheck.alias ||
              dataToCompare.name === dataToCheck.name ||
              dataToCompare.image === dataToCheck.image,
        ),
    );
    return {
      isDuplicates: duplicates,
      dataBringed: dataArray,
    };
  } catch (error) {
    console.log(error);
    return {
      isDuplicates: [false],
      dataBringed: [],
    };
  }
};

module.exports = findDuplicatesInArray;
