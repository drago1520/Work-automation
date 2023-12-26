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
    return response.data.value;
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
    console.log(element);
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
  console.log(sheetData);
  for (let i = 0; i < sheetData.length; i++) {
    console.log(sheetData[i]);
  }
  const urls = sheetData;
  const browser = await openBrowser();
  for (let i = 0; i < urls.length; i++){
  console.log("Opening url: ", urls[i], i);
  const page = await openNewPage(urls[i], browser);
  const editButton = await selectXpath("//li[@id='wp-admin-bar-edit']/a", page);
  console.log(editButton);
  await clickElement(editButton);
  await page.waitForXPath("//div[@id='yoast-google-preview-description-metabox']", { visible: true });
  console.log("loaded");
  const metaDescriptionBox = await selectXpath("//div[@id='yoast-google-preview-description-metabox']", page);
  await metaDescriptionBox.focus();
  
  // const saveButton = await selectXpath("//div[@class='edit-tag-actions']/input[@type='submit']", page);
  // //Just to check.
  // await delay(4000);
  // const navigationPromise = page.waitForNavigation()
  // await clickElement(saveButton);
  // await navigationPromise;
  await delay(2999000);
  //await page.close();
  
  console.log(`${urls[i]} modified successfully!`);
  }}
  
Pagenation().catch(console.error);

}



main().catch(console.error);

