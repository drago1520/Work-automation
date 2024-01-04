import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());

export default async function openBrowser(){
  try{
    const browser = await puppeteer.launch({headless: false});
    
    return browser;
  }catch(e){
    console.log(e);
  }
}