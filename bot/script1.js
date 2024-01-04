import "dotenv/config";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());
import fetchSheetData2D from "../libs/fetchSheetData.js";
import openNewPage from "../libs/openNewPage.js";
import selectXpath from "../libs/selectXpath.js";
import clickElement from "../libs/clickElement.js";
import delay from "../libs/delay.js";
import openBrowser from "../libs/openBrowser.js";
import fs from "fs";
import path from "path";
import selectXpathNoWait from "../libs/selectXpathNoWait.js";
import wpSubmit from "../libs/wpSubmit.js";
let index;
let end;

async function RestartLog(firstUrlIndex, lastUrlIndex){
  async function getScriptName(){
    // Get the full path of the script
  const fullPath = process.argv[1];

// Get just the file name with extension
  const fileNameWithExtension = path.basename(fullPath);
    return fileNameWithExtension;
  }
  let fileName = "restartLog.txt";
  const scriptName = await getScriptName();
  fs.appendFile(fileName,  `node ${scriptName} ${firstUrlIndex} ${lastUrlIndex} \n`, function(err) {
    if (err) throw err;
    console.log('Saved!');
});
}
function parseSpintax(spintax) {
  var match, result = spintax, regex = /\{([^{}]*)\}/;

  while (match = regex.exec(result)) {
      var choices = match[1].split("|");
      result = result.replace(match[0], choices[Math.floor(Math.random() * choices.length)]);
  }

  return result;
}

function countCharacters(text) {
  return text.length;
}
async function main(){
  
  
  process.on('SIGINT', async function() {
    await RestartLog(index, end);
    console.log("Program terminated - log file created.");
    // Gracefully shut down anything else you need to here
    await delay(3000);
    console.log("delayed successfully!  Terminating.");
    process.exit(); // This will terminate the application
  
});
async function Pagenation(){
  const spreadsheetId = '1AjhMb9FV2puTMoPXQtNfdB2QD__j3pTWnpYgJCcU55o'; // Your Spreadsheet ID
  const sheetData = await fetchSheetData2D(spreadsheetId);
  let urls = [];
  let charCount = [];
  for (let i = 0; i < sheetData.length; i++) {
    
    urls.push(sheetData[i][0]);
    let countString = sheetData[i][2];
    let countNumber = parseInt(countString, 10);
    charCount.push(countNumber);
    
  }
  
  
  let start = parseInt(process.argv[2], 10);
  end = parseInt(process.argv[3], 10);
  console.log(start, end);
  //await delay(60000);
  const browser = await openBrowser();
  for (let i = start; i < end; i++){
  index = i;
  console.log("Opening url: ", urls[i], i);
  console.log("charCount: ", charCount[i]);
  const page = await openNewPage(urls[i], browser);
  const editButton = await selectXpath("//li[@id='wp-admin-bar-edit']/a", page);
  const navigationPromise1 = page.waitForNavigation({timeout: 300000, waitUntil: 'domcontentloaded'});
  await clickElement(editButton);
  await navigationPromise1;
  console.log("loaded");
  const metaDescriptionBox = await selectXpath("//div[@id='yoast-google-preview-description-metabox']", page);
  await metaDescriptionBox.focus();
  const progressBar = await selectXpath("//progress[@max='156']", page);
  let valueProgressBarString = await page.evaluate(el => el.getAttribute('value'), progressBar);
  const valueProgressBar = parseInt(valueProgressBarString, 10);
  let textInput = "";
  if (charCount[i] < 51 && charCount[i] > 0){
    textInput = "%%title%% в онлайн магазин %%sitename%%   Поръчайте със 100% дискретна експресна доставка. Въображението ви е границата! ❤️ %%page%%"
  }else if(charCount[i] < 82 && charCount[i] > 50){
    textInput = "%%title%% в онлайн магазин %%sitename%%  Поръчайте сега със 100% дискретна експресна доставка. ❤️  %%page%%"
  }else if (charCount[i] < 106 && charCount[i] > 81){
    textInput = "%%title%% в онлайн магазин %%sitename%%   100% дискретна доставка. ❤️%%page%%"
  }else{console.log("error")};
  
  if(valueProgressBar >= 120 && valueProgressBar <= 156 || urls[i].includes("/page/")){
    
    console.log(`Progress bar: ${valueProgressBar} with page: ${urls[i].includes("/page/")}`);
    fs.appendFileSync("../readyURLs.txt", `${urls[i]}\n`, function (err) {
      console.log(err);
    })
    await wpSubmit(page);

  }else if(valueProgressBar > 156){
    console.log("long description!");
    fs.appendFileSync("../errorMeta.txt", `${urls[i]}\n`, function (err) {
      if (err) throw err;
    });
    await wpSubmit(page);
  }else if (valueProgressBar == 0){
    await page.type("#yoast-google-preview-description-metabox", textInput, {delay: 10});
    fs.appendFileSync("../readyURLs.txt", `${urls[i]}\n`, function (err) {
      console.log(err);
    })
    await wpSubmit(page);
  }else{
    console.log("WTF??!");
    fs.appendFileSync("../checkIt.txt", `${urls[i]} is bugged. \n`, function (err) {
      if (err) throw err;
    });
  }
  

  await delay(4000);
  
  //await navigationPromise;
  await page.close();
  
  console.log(`${urls[i]} modified successfully!`);
  }
}
  
Pagenation().catch((e)=>{
  RestartLog(index, end);
  console.log(e);
});

}



main().catch((e)=>{
  console.log(e);
  RestartLog(index, end);
});

