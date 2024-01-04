import "dotenv/config";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());
import fs from "fs";
import axios from "axios";


async function wpSubmit(page){
  const navigationPromise = page.waitForNavigation({timeout: 300000, waitUntil: 'domcontentloaded'});
  await delay(2000);
  await page.evaluate(() => {
    window.scrollBy(0, 20); // Scrolls down 20 pixels
  });
  let saveButton = await selectXpathNoWait("//input[@type='submit' and @name='save' and @id='publish']", page);
  if(!saveButton){
    console.log("Trying variant 2...");
    saveButton = await selectXpathNoWait("//div[@class='edit-tag-actions']/input[@type='submit']", page);
    if(saveButton){
      console.log("Button variant 2 found!");
    }else if(!saveButton){
      console.log("Trying variant 3...");
      saveButton = await selectXpathNoWait("//input[@type='submit' and @name='publish' and @id='publish']", page);
      if (saveButton) {
        console.log("Button variant 3 found!");
      }else if (!saveButton){
        console.log("Trying variant 4...");
        saveButton = await selectXpathNoWait("//button[@type='button' and contains(@class, 'components-button') and contains(@class, 'editor-post-publish-button') and contains(@class, 'editor-post-publish-button__button') and contains(@class, 'is-primary')]", page);
        if (saveButton) {
          console.log("Button variant 4 found!");
        }else if (!saveButton){
          console.log("Button 4 not found!");
        }
      }
    }else{
      console.log("WTF??!");
    }
  }
  else if(saveButton){
    
  }
  //bug - submit button hides when scrolling up??!
  await page.evaluate(() => {
    window.scrollBy(0, 20); // Scrolls down 20 pixels
  });
  await clickElement(saveButton);
  
  await navigationPromise;

}
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
async function selectXpathNoWait(path, page){
    try{
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

async function selectXpath(path, page){
    try{
      await page.waitForXPath(path, { visible: true, timeout: 300000});
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

async function openNewPage(url, browser){
  try{
    const page = await browser.newPage();
    await loadCoockies("../cookies.json", page);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 300000 });

    //LOAD COOCKIES
    
    return page;
  }catch(error){
    console.log(error);
  }
}
async function loadCoockies(pathToCookies, page){
  const coockiesString = fs.readFileSync(pathToCookies);
    const coockies = await JSON.parse(coockiesString);
    await page.setCookie(...coockies);
}
async function openBrowser(){
  try{
    const browser = await puppeteer.launch({headless: false});
    
    return browser;
  }catch(e){
    console.log(e);
  }
}
async function delay (ms){
  await new Promise(resolve => setTimeout(resolve, ms));
}
async function closePage (){
  try{
    await page.close();
  }catch(e){
    console.log(e);
  }
}  
async function clickElement(element){
   
  if(element){
    await element.click();
  }else{
    console.log('Element not found in clickElement()');
  }
}
async function clickEditWP(page) {
  const editButton = await selectXpath("//li[@id='wp-admin-bar-edit']/a", page);
 const navigationPromise1 = page.waitForNavigation({timeout: 300000, waitUntil: 'domcontentloaded'});
 await clickElement(editButton);
 await navigationPromise1;
 console.log("loaded");
}
async function focusMetaDescriptionBox(page){
  const metaDescriptionBox = await selectXpath("//div[@id='yoast-google-preview-description-metabox']", page);
  await metaDescriptionBox.focus();
}
//let valueProgressBar = await getCurrentProgressBarValue(page);
async function getCurrentProgressBarValue(page){
  const progressBar = await selectXpath("//progress[@max='156']", page);
  let valueProgressBarString = await page.evaluate(el => el.getAttribute('value'), progressBar);
  const valueProgressBar = parseInt(valueProgressBarString, 10);
  return valueProgressBar;
}
//crashLog(index, end);
async function crashLog(index, end){
  process.on('SIGINT', async function() {
    await RestartLog(index, end);
    console.log("Program terminated - log file created.");
    // Gracefully shut down anything else you need to here
    await delay(3000);
    console.log("delayed successfully!  Terminating.");
    process.exit(); // This will terminate the application
  
});
}

// Single-line export statement
export { wpSubmit, fetchSheetData2D, selectXpathNoWait, selectXpath, openNewPage, loadCoockies, openBrowser, delay, closePage, clickElement, clickEditWP, focusMetaDescriptionBox, getCurrentProgressBarValue, crashLog };