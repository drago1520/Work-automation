//!!!!!!!!!!!!!  САМО ЗА БЪЛГАРСКИ !!!!!!!!!!!!!!!
//!!!!!!!!!!!!!  САМО ЗА БЪЛГАРСКИ !!!!!!!!!!!!!!!
import axios from "axios";
import "dotenv/config";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());
import "dotenv/config";

async function main(){
  async function fetchSheetData() {
    const spreadsheetId = '1nD5gnRe7WnIXtvsF5M-hBU390TqhHApIeGEo0k7ydwA';
    const sheetName = 'Sheet1';
    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${GOOGLE_SHEET_API_FACEBOOK}`;
    let flatArrayURL = [];
    
    try {
      const response = await axios.get(apiUrl);
      flatArrayURL = response.data.values.flat();
    } catch (error) {
      console.error(`Error fetching data: ${error}`);
    }
    return flatArrayURL;
  }
  
  
  async function facebookGroups() {
    const urls = await fetchSheetData();
    console.log(urls);
    
      
      //# executablePath: "<от къде да отвори google?>", userDataDir: "<къде се намира userDataDir>"
      const browser = await puppeteer.launch({headless: false, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', userDataDir: 'C:\\Users\\Dell\\AppData\\Local\\Google\\Chrome\\User Data'  });
      
      //# i = първият URL - 1.  (обяснение: 1-ви елемент в Google Sheets = 0, защото програмистите броят от 0,1,2,3,4,...)
      for (let i = 0; i < urls.length; i++) { 
  
        const url = urls[i];
        const page = await browser.newPage();
        console.log(url);
        try{
          console.log(`Opening ${url}`);
          await page.goto(url, { waitUntil: 'networkidle0' });
          await page.waitForXPath('//*[text()="Напишете нещо..."]', { visible: true });
          let elements = await page.$x('//*[text()="Напишете нещо..."]');
          let NewPostButton_1 = elements[0]; // assuming it's the first element matching the XPath
          await NewPostButton_1.click();
          await NewPostButton_1.focus();
          
          // Wait for the element to be visible
          await page.waitForXPath('//span[contains(text(), "Публикуване")]', { visible: true });
          //Ctrl + V
          await page.keyboard.down('Control');
  
          // Press the 'V' key
          await page.keyboard.press('V');
  
          // Release the Control key
          await page.keyboard.up('Control');
          let SubmitButton_2Array = await page.$x('//span[contains(text(), "Публикуване")]');
          let SubmitButton_2 = SubmitButton_2Array[0];
          await new Promise(resolve => setTimeout(resolve, 2000));
          await SubmitButton_2.click();
          console.log("Posted on url: " + url);
          await new Promise(resolve => setTimeout(resolve, 10000)); //Да зареди post submit... Може още оптимизация. Сега чака 6 сек. да се submit-не
          await page.close();
          await new Promise(resolve => setTimeout(resolve, 2000)); //След колко време да отвори другия URL; #сложи рандом сек. забавяне м/у всяко действие
        }catch(error){
          console.log(error);
          console.log("Probably the facebook page is not accesible");
          console.log("Did not post on url: " + url);
          await page.close();
          await new Promise(resolve => setTimeout(resolve, 2000)); //След колко време да отвори другия URL; #сложи рандом сек. забавяне м/у всяко действие
        }}
      console.log("All urls have been posted!");
      }
   
  //# Should it post on Facebook groups? - to comment out the function place //facebookGroups().catch(console.error); / to run it place facebookGroups().catch(console.error);
  //facebookGroups().catch(console.error);
  
  
  
}
main().catch(console.error);

