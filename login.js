//VERY specific for Facebook. need two-auth
//Insta - fine
import "dotenv/config";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());
import fs from 'fs';


async function main(){

  async function loadCoockies(pathToCookies, page){
    const coockiesString = fs.readFileSync(pathToCookies);
      const coockies = await JSON.parse(coockiesString);
      await page.setCookie(...coockies);
  }
  
  async function openNewPage(url, browser){
    try{
      const page = await browser.newPage();
     // await loadCoockies("./cookies.json", page);
      await page.goto(url, { waitUntil: 'networkidle2' });

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
async function Login(){
  const browser = await openBrowser();
  const url = "https://www.aphrodisiac.bg/wp-login.php?redirect_to=https%3A%2F%2Fwww.aphrodisiac.bg%2Fwp-admin%2F&reauth=1"; //Login page
  const page = await openNewPage(url, browser);
  await page.type("#user_login", process.env.USER_NAME, {delay: 100});
  await page.type("#user_pass", process.env.USER_PASSWORD, {delay: 100});
  await delay(2000);
  await page.click('#rememberme'); //ONLY for Wordpress. Save login info in cookies
  await page.click('#wp-submit');
  await page.waitForNavigation({
    waitUntil: 'networkidle2',
  });
  
  //SAVE COOKIES
  await delay(2000);
  const cookies = await page.cookies();
  fs.writeFileSync('./cookies.json', JSON.stringify(cookies, null, 2));
  await delay(999999999);

  



  }
  
Login().catch(console.error);

}



main().catch(console.error);

