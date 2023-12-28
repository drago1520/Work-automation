import fs from "fs";
export default async function openNewPage(url, browser){
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
export async function loadCoockies(pathToCookies, page){
  const coockiesString = fs.readFileSync(pathToCookies);
    const coockies = await JSON.parse(coockiesString);
    await page.setCookie(...coockies);
}