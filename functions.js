import csv from "csv-parser";
import ObjectsToCsv from "objects-to-csv";
import fs from "fs";

const getPosts = () => {
  const results = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream("data.csv")
      .on("error", (error) => {
        reject(error);
      })
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        resolve(results);
      });
  });
};

const fileName = (str) =>
  str
    .replace(/\s+/g, "-")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[.,\/#!$%\^&\*;:{}=\_?`~()]/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/ł/g, "l");

const saveTxt = async (content, title) => {
  const name = fileName(title);
  try {
    fs.writeFileSync(`posts/${name}.txt`, content);
    console.log("Zapisano tekst na dysku");
  } catch (err) {
    console.error(err);
  }
};

const saveToCsv = async (data) => {
  const csv = new ObjectsToCsv(data);
  await csv.toDisk("./summary.csv");
};

export { getPosts, saveTxt, fileName, saveToCsv };
