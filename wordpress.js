import fetch from "node-fetch";
import fs from "fs";
import * as dotenv from 'dotenv';
dotenv.config();
import { fileName } from "./functions.js";

async function uploadImage(path, title) {
  const name = fileName(title);
  const createdImage = await fetch(`${process.env.WP_ENDPOINT}media`, {
    method: "POST",
    headers: {
      "Content-Disposition": `attachment; filename="${name}.jpg"`,
      "Content-Type": "image/jpeg",
      Authorization: `Basic ${Buffer.from(
        `${process.env.WP_USER}:${process.env.WP_PASS}`,
        "utf-8"
      ).toString("base64")}`,
    },
    body: fs.readFileSync(path, (err, data) => {
      if (err) {
        console.log(err);
      }
    }),
  }).then((response) => response.json());
  return createdImage.id;
}

async function createPost(title, content, imageId, categories, tags) {
  const createdPost = await fetch(`${process.env.WP_ENDPOINT}posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(
        `${process.env.WP_USER}:${process.env.WP_PASS}`,
        "utf-8"
      ).toString("base64")}`,
    },
    body: JSON.stringify({
      title: title,
      content: content,
      featured_media: imageId ? imageId : null,
      status: process.env.WP_POST_STATUS,
      categories: categories,
      tags: tags,
    }),
  }).then((response) => response.json());
  return createdPost;
}

export { uploadImage, createPost };
