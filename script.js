//!!!!!!!!!!!!!  САМО ЗА БЪЛГАРСКИ !!!!!!!!!!!!!!!
//!!!!!!!!!!!!!  САМО ЗА БЪЛГАРСКИ !!!!!!!!!!!!!!!
import axios from "axios";
import "dotenv/config";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());
import fs from "fs";


async function main(){
    async function loadCoockies(pathToCookies, page){
      const coockiesString = fs.readFileSync(pathToCookies);
        const coockies = await JSON.parse(coockiesString);
        await page.setCookie(...coockies);
  }
  
  //const urls = await fetchSheetData(spreadSheetID);
  async function fetchSheetData2D(spreadSheetID) {
    const spreadsheetId = spreadSheetID;
    const sheetName = 'Sheet1';
    const SheetsAPIFacebook = process.env.GOOGLE_SHEET_API_FACEBOOK;
    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${SheetsAPIFacebook}`;
    let response = [];
    
    try {
      response = await axios.get(apiUrl);

      //flatArrayURL = response.data.values.flat();
      
    } catch (error) {
      console.error(`Error fetching data: ${error}`);
    }
    const sheet2D = response.data.values;
    return sheet2D;
  }
  //
  async function openNewPage(url, browser){
    try{
      const page = await browser.newPage();
      await loadCoockies("./cookies.json", page);
      await page.goto(url, { waitUntil: 'load' });

      //LOAD COOCKIES
      
      return page;
    }catch(error){
      console.log(error);
    }
  }
  async function selectXpath(path, page){
    try{
      await page.waitForXPath(path, { visible: true });
          let elements = await page.$x(path);
          let NewPostButton_1 = elements[0];
          if(NewPostButton_1){
            return NewPostButton_1;
          }else{
            console.log('Element not found in selectXpath()');
          }
    }catch(error){
      console.log(error);
    }
          
  }

  //
  async function clickElement(element){
   
    if(element){
      await element.click();
    }else{
      console.log('Element not found in clickElement()');
    }
  }
  //
  async function delay (ms){
    await new Promise(resolve => setTimeout(resolve, ms));
  }
  //const page = await openBrowser();
  async function openBrowser(){
    try{
      const exePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
      const browser = await puppeteer.launch({headless: false, executablePath: exePath});
      
      return browser;
    }catch(e){
      console.log(e);
    }
  }
  async function closePage (){
    try{
      await page.close();
    }catch(e){
      console.log(e);
    }
  }  
async function Pagenation(){
  const spreadsheetId = '1AjhMb9FV2puTMoPXQtNfdB2QD__j3pTWnpYgJCcU55o'; // Your Spreadsheet ID
  const sheetData = await fetchSheetData2D(spreadsheetId);
  let urls = [];
  let charCount = [];
  for (let i = 0; i < sheetData.length; i++) {
    urls.push(sheetData[i][0]);
    charCount.push(sheetData[i][2]);
    
  }
  await delay(300000);
  const browser = await openBrowser();
  for (let i = 0; i < urls.length; i++){
  console.log("Opening url: ", urls[i], i);
  console.log("charCount: ", charCount[i]);
  const page = await openNewPage(urls[i], browser);
  const editButton = await selectXpath("//li[@id='wp-admin-bar-edit']/a", page);
  await clickElement(editButton);
  await page.waitForXPath("//div[@id='yoast-google-preview-description-metabox']", { visible: true });
  console.log("loaded");
  const metaDescriptionBox = await selectXpath("//div[@id='yoast-google-preview-description-metabox']", page);
  await metaDescriptionBox.focus();
  let textInput = "";
  if (charCount[i] < 51 && charCount[i] > 0){
    textInput = "%%title%% в онлайн магазин %%sitename%%   Поръчайте със 100% дискретна експресна доставка. Въображението ви е границата! ❤️ %%page%%"
  }else if(charCount[i] < 82 && charCount[i] > 50){
    textInput = "%%title%% в онлайн магазин %%sitename%%  Поръчайте сега със 100% дискретна експресна доставка. ❤️  %%page%%"
  }else if (charCount[i] < 106 && charCount[i] > 81){
    textInput = "%%title%% в онлайн магазин %%sitename%%   100% дискретна доставка. ❤️%%page%%"
  }else{console.log("error")};
 
  await page.type("#yoast-google-preview-description-metabox", textInput, {delay: 10});
  const saveButton = await selectXpath("//div[@class='edit-tag-actions']/input[@type='submit']", page);
  //Just to check.
  await delay(4000);
  const navigationPromise = page.waitForNavigation()
  const progressBar = await selectXpath("//progress[@max='156']", page);
  const valueProgressBar = await page.evaluate(el => el.getAttribute('value'), progressBar);
  if(valueProgressBar >= 120 && valueProgressBar <= 156){
    // await clickElement(saveButton);
    console.log("progressBar: ", valueProgressBar);
  }else{
    throw new Error(`Error: the meta description is ${valueProgressBar} characters long. It is not within limits at ${urls[i]}${i}`);
  }


  
  await navigationPromise;
  await page.close();
  
  console.log(`${urls[i]} modified successfully!`);
  }
}
  
Pagenation().catch(console.error);

}



main().catch(console.error);

