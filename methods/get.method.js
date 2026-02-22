const { readFile } = require("fs/promises");
const path = require("path");

const onGetMethodSummary = async (res) => {
  try {
    const summaryPath = path.join(__dirname, "../DB/SummaryData.json");
    const summaryData = await readFile(summaryPath);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.statusCode = 200;
    res.end(summaryData);
  } catch (error) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.statusCode = 500;
    res.end(`<h1>Iternal Server Error</h1><p>${error.message}</p>`);
  }
  return;
};
const onGetMethodHero = (res, id) => {};
const onGetMethodVillain = (res, id) => {};

module.exports = { onGetMethodHero, onGetMethodSummary, onGetMethodVillain };
