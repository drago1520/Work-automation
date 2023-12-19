//!!!!!!!!!!!!!  САМО ЗА БЪЛГАРСКИ !!!!!!!!!!!!!!!
//!!!!!!!!!!!!!  САМО ЗА БЪЛГАРСКИ !!!!!!!!!!!!!!!
import axios from "axios";
import "dotenv/config";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());


async function main(){
  
  //const urls = await fetchSheetData(spreadSheetID);
  async function fetchSheetData(spreadSheetID) {
    const spreadsheetId = spreadSheetID;
    const sheetName = 'Sheet1';
    const SheetsAPIFacebook = process.env.GOOGLE_SHEET_API_FACEBOOK;
    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${SheetsAPIFacebook}`;
    let flatArrayURL = [];
    
    try {
      const response = await axios.get(apiUrl);
      flatArrayURL = response.data.values.flat();
    } catch (error) {
      console.error(`Error fetching data: ${error}`);
    }
    return flatArrayURL;
  }
  //
  async function openNewPage(url, browser){
    try{
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle0' });
      return page;
    }catch(error){
      console.log(error);
    }
  }
  //const <areaName> = await selectXpath(<path>);
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
      const userDataGeneral = 'C:\\Users\\Dell\\AppData\\Local\\Google\\Chrome\\User Data';
      const browser = await puppeteer.launch({headless: false, executablePath: exePath, userDataDir: userDataGeneral  });
      
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
  const spreadsheetId = '1YxcrNipNI3l8GWzz-p8mb4-IUvmmAg7f2ZyyDaAxSIU'; // Your Spreadsheet ID
  const urls = await fetchSheetData(spreadsheetId);
  const browser = await openBrowser();
for (let i = 109; i<urls.length; i++){
  console.log("Opening url: ", urls[i], i);
  const page = await openNewPage(urls[i], browser);
  const editButton = await selectXpath("//li[@id='wp-admin-bar-edit']/a", page);
  await clickElement(editButton);
  await page.waitForXPath("//div[@id='yoast-google-preview-description-metabox']", { visible: true });
  console.log("loaded");
  const metaDescriptionBox = await selectXpath("//div[@id='yoast-google-preview-description-metabox']", page);
  await metaDescriptionBox.focus();
  await page.keyboard.down('Control'); // Hold down the 'Control' key
  await page.keyboard.press('End'); // Press the 'End' key while 'Control' is held down
  await page.keyboard.up('Control'); // Release the 'Control' key
  await page.keyboard.press('Space');
  await page.keyboard.type('%%page%%');
  const saveButton = await selectXpath("//div[@class='edit-tag-actions']/input[@type='submit']", page);
  //Just to check.
  await delay(4000);
  const navigationPromise = page.waitForNavigation()
  await clickElement(saveButton);
  await navigationPromise;
  await delay(2000);
  await page.close();
  
  console.log(`${urls[i]} modified successfully!`);
  }}
  
Pagenation().catch(console.error);

//Успешно добави на БГ. #провери и другите за 











  
}
main().catch(console.error);

