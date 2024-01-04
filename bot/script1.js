import "dotenv/config";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());
import fs from "fs";
import path from "path";
import { wpSubmit, fetchSheetData2D, selectXpathNoWait, selectXpath, openNewPage, loadCoockies, openBrowser, delay, closePage, clickElement, clickEditWP, focusMetaDescriptionBox, getCurrentProgressBarValue, crashLog } from '../libs/1WP-functions.js';
let index = 0;
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
  
  
//   process.on('SIGINT', async function() {
//     await RestartLog(index, end);
//     console.log("Program terminated - log file created.");
//     // Gracefully shut down anything else you need to here
//     await delay(3000);
//     console.log("delayed successfully!  Terminating.");
//     process.exit(); // This will terminate the application
  
// });


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
  index = 0;
  crashLog(index, end);
  const browser = await openBrowser();
  for (let i = start; i < end; i++){
  index = i;
  
  console.log("Opening url: ", urls[i], i);
  console.log("charCount: ", charCount[i]);
  const page = await openNewPage(urls[i], browser);
  await clickEditWP(page);
  await focusMetaDescriptionBox(page);
  let valueProgressBar = await getCurrentProgressBarValue(page);
  let formula = "";
  let textInput = "";
  if (charCount[i] <= 53 && charCount[i] >= 22){
    formula = "%%title%% в {онлайн магазин| уеб магазина на|дигитален магазин|е-магазина на} %%sitename%% {Поръчайте със 100% дискретна експресна доставка|Купете с напълно конфиденциална бърза доставка|Заявете днес с изцяло дискретна бърза доставка}. {Границата е само въображението|Няма граници в избора при нас|Не може дори да си представите}! {❤️|💖|❣️} %%page%%"
  }else if(charCount[i] <= 80 && charCount[i] >= 54){
    formula = "%%title%% в {онлайн магазин| уеб магазина на|дигитален магазин|е-магазина на} %%sitename%% {Поръчайте лесно с 100% дискретна експресна доставка|Купете сега с напълно конфиденциална бърза доставка|Заявете днес с изцяло поверителна бърза доставка}! {❤️|💖|❣️} %%page%%"
  }else if (charCount[i] <= 106 && charCount[i] >= 80){
    formula = "%%title%% в {онлайн магазин|уеб магазина|онлайн секс шоп|е-магазина на} %%sitename%% {100% дискретна доставка|Конфиденциална доставка|Поверителна бърза доставка}! {❤️|💖|❣️} %%page%%"
  }else{console.log("error")};
    textInput = parseSpintax(formula);


  //Checks if it already has the old shitty meta descr.
  let proofModifiedScript = await selectXpathNoWait("//div[@id='yoast-google-preview-description-metabox' and @contenteditable='true']//span[@data-text='true' and contains(text(), 'Страница')]", page);
  if (proofModifiedScript){
    fs.appendFileSync("./modified.txt", `${urls[i]}\n`, function (err) {
      console.log(err);
    });
    await focusMetaDescriptionBox(page);
    await page.keyboard.down('Control'); // 'Command' on macOS
    await page.keyboard.press('A');      // Select all text
    await page.keyboard.up('Control');   // 'Command' on macOS
    await page.keyboard.press('Backspace'); // Delete the text
  }

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
  
  //await navigationPromise; - ако искам да изчаква при fail
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

