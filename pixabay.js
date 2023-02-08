import fetch from "node-fetch";
import download from "image-downloader";
import { keys } from "./keys.js";
import { fileName } from "./functions.js";

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const downloadImage = (url, title) => {
  const name = fileName(title);
  const options = {
    url: url,
    dest: `../../posts/${name}.jpg`, // will be saved to /path/to/dest/photo.jpg
  };

  return download
    .image(options)
    .then(({ filename }) => {
      return filename; // saved to /path/to/dest/photo.jpg
    })
    .catch((err) => console.error(err));
};

const getImage = async (q, title) => {
  const query = encodeURIComponent(q);
  const url = `https://pixabay.com/api/?key=${keys.PB_KEY}&q=${query}&image_type=photo?lang=en`;
  const data = await fetch(url)
    .then((res) => (res.status === 200 ? res.json() : null))
    .catch((error) => console.log(error));
  if (data?.hits) {
    const image = data.hits[random(0, data.hits.length)]
      ? data.hits[random(0, data.hits.length)].webformatURL
      : null;
    const path = image ? await downloadImage(image, title) : null;
    return path;
  } else {
    return null;
  }
};

export { getImage };
