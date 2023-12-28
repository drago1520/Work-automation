import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());

export default async function openBrowser(){
  try{
    const exePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
    const browser = await puppeteer.launch({headless: "new", executablePath: exePath});
    
    return browser;
  }catch(e){
    console.log(e);
  }
}