import { Configuration, OpenAIApi } from "openai";
import * as dotenv from 'dotenv';
dotenv.config();

const createContent = async (title, headings = false) => {
  if (!headings) {
    console.log(`piszę: ${title}`);
  }

  const configuration = new Configuration({
    apiKey: process.env.AI_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const prompt = headings
    ? `Napisz dwa akapity na temat "${title}".`
    : `Napisz zoptymalizowany pod SEO artykuł blogowy na temat "${title}". Tekst powinien zawierać 3 nagłówki, dla każdego nagłówka napisz 2 akapity. Tekst ma być sformatowany do HTML, nagłówki umieść w <h2>, a akapity w <p>`;
  let failedRequests = 0;
  const maxFails = 4;
  const retry = async (ms) =>
    new Promise((resolve) => {
      openai
        .createCompletion({
          model: "text-davinci-003",
          prompt: prompt,
          temperature: 1,
          max_tokens: 3700,
          top_p: 0,
          frequency_penalty: headings ? 0.5 : 0.3,
          presence_penalty: headings ? 1 : 0.7,
        })
        .then((res) => resolve(res.data.choices[0].text))
        .catch((error) => {
          if (
            (error.response.status === 429 || error.response.status === 500) &&
            failedRequests < maxFails
          ) {
            setTimeout(() => {
              failedRequests++;
              console.log(
                `powtarzam: ${title} (${error.response.statusText}) ${failedRequests} / ${maxFails}`
              );
              retry(ms).then(resolve);
            }, ms);
          } else {
            resolve({
              error: true,
              statusText: error.response.statusText,
            });
          }
        });
    });

  const response = await retry(5000);
  return response;
};

const contentWithHeadings = async (title, headings) => {
  console.log(`piszę: ${title}`);

  const arr = headings.map((item) => createContent(item, true));
  const formatText = (item) => {
    return item
      .split("\n")
      .map((item) => `<p>${item}</p>`)
      .filter((item) => item !== "<p></p>")
      .join("\n");
  };
  const res = await Promise.all(arr)
    .then((result) =>
      result?.map(
        (item, index) => `<h2>${headings[index]}</h2>\n${formatText(item)}`
      )
    )
    .catch((error) => {
      return {
        error: true,
        statusText: "Wystąpił błąd podczas tworzenia treści",
      };
    });
  return !res.error ? `<h1>${title}</h1>\n${res?.join("\n")}` : res;
};

export { createContent, contentWithHeadings };
