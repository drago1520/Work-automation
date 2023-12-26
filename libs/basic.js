async function loadCoockies(pathToCookies, page){
  const coockiesString = fs.readFileSync(pathToCookies);
    const coockies = await JSON.parse(coockiesString);
    await page.setCookie(...coockies);
}

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

export {loadCoockies, fetchSheetData, openNewPage, selectXpath, clickElement, delay, openBrowser, closePage};

//import {loadCoockies, fetchSheetData, openNewPage, selectXpath, clickElement, delay, openBrowser, closePage} from './libs/basic.js';