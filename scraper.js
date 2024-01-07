const puppeteer = require("puppeteer-extra");

const { DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } = require("puppeteer");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
puppeteer.use(
  AdblockerPlugin({
    interceptResolutionPriority: DEFAULT_INTERCEPT_RESOLUTION_PRIORITY,
  })
);
async function scrape(url) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(url); // wait an arbituary .5 seconds and hit esc thats it

  const textareaXPath = '//*[@id="chatboxWrapperId_0"]/textarea';
  const submitButton = '//*[@id="chatSubmitButton"]';
  const searchString =
    '<div class="chipsBox"></div><div class="optionsBox" contenteditable="false"><button class="searchButton" id="search" type="button">Search Web</button><button class="copytextButton" type="button" id="copyButtonId_1">Copy</button><button class="summarizetextButton" type="button" id="sumButtonId">Summarize</button><button class="deleteBoxButton" type="button">Delete</button></div>';

  await page.waitForXPath(textareaXPath);
  const textarea = (await page.$x(textareaXPath))[0];
  await textarea.type("Give me 10 random words related to joking");
  console.log("Text inputted successfully.");

  await page.waitForXPath(submitButton);
  const button = (await page.$x(submitButton))[0];
  await button.click();
  console.log("Submit Button Clicked");

  let copyButtonFound = false;

  while (!copyButtonFound) {
    const copyButton = await page.$x('//*[@id="copyButtonId_1"]');
    if (copyButton.length > 0) {
      copyButtonFound = true;
    } else {
      await page.waitForTimeout(2000);
    }
  }

  const outputBoxes = await page.$$eval(".outputBox", (boxes) => {
    return boxes.map((box) => box.innerHTML);
  });

  var result;
  for (let i = 0; i < outputBoxes.length; i++) {
    result = outputBoxes[i]
  }
  result = result.replace(searchString, "")

  console.log("Output Boxes InnerHTML:", result);

  await browser.close();
}

scrape("https://deepai.org/chat");
