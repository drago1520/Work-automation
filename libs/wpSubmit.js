import selectXpathNoWait from "./selectXpathNoWait.js";
import clickElement from "./clickElement.js";
import "dotenv/config";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());
import delay from "./delay.js";

export default async function wpSubmit(page){
  const navigationPromise = page.waitForNavigation({timeout: 300000, waitUntil: 'domcontentloaded'});
  await delay(2000);
  let saveButton = await selectXpathNoWait("//input[@type='submit' and @name='save' and @id='publish']", page);
  if(!saveButton){
    console.log("Trying variant 2...");
    saveButton = await selectXpathNoWait("//div[@class='edit-tag-actions']/input[@type='submit']", page);
    if(saveButton){
      console.log("Button variant 2 found!");
    }
  }else if(!saveButton){
    console.log("Button variant 1 and 2 NOT found!");
  }else if(saveButton){
    
  }
  //bug - submit button hides when scrolling up??!
  await page.evaluate(() => {
    window.scrollBy(0, 20); // Scrolls down 20 pixels
  });
  await clickElement(saveButton);
  
  await navigationPromise;

}