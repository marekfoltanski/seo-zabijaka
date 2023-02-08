import { getPosts, saveTxt, saveToCsv } from "./functions.js";
import { createContent, contentWithHeadings } from "./openai.js";
import { getImage } from "./pixabay.js";
import { uploadImage, createPost } from "./wordpress.js";

const mainFunction = async (post, summary, options) => {
  const { wordpress } = options;
  const image = post["Image search query"] == "" ? false : true;
  const headings = post["Headings"].split("\n");
  const content =
    headings[0] !== ""
      ? await contentWithHeadings(post["Title"], headings)
      : await createContent(post["Title"]);
  if (content.error) {
    console.log(content.statusText);
    summary.push({
      title: post["Title"],
      content: "-",
      url: "-",
    });
  } else {
    saveTxt(content, post["Title"]);
    const imagePath = image
      ? await getImage(post["Image search query"], post["Title"])
      : null;
    const imageId = imagePath
      ? await uploadImage(imagePath, post["Title"])
      : null;

    if (wordpress) {
      const categories = post["Categories"];
      const tags = post["Tags"];
      const createdPost = await createPost(
        post["Title"],
        content,
        imageId,
        categories,
        tags
      );
      console.log(`Wpis utworzony: ${createdPost.link}`);
      summary.push({
        title: post["Title"],
        content: content,
        url: createdPost.link,
      });
    } else {
      summary.push({
        title: post["Title"],
        content: content,
      });
    }
  }
};

const app = async (
  options = {
    wordpress: true,
  }
) => {
  const posts = await getPosts();
  let summary = [];
  let n = 1;
  for (const post of posts) {
    console.log(`${n} / ${posts.length}`);
    await mainFunction(post, summary, options);
    console.log(`-----------------------------------------`);
    n++;
  }
  saveToCsv(summary);
  console.log("DONE");
};

app({
  wordpress: true,
});
