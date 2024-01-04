import selectXpath from "./selectXpath.js";
import clickElement from "./clickElement.js";

export default async function clickEditWP(page) {
   const editButton = await selectXpath("//li[@id='wp-admin-bar-edit']/a", page);
  const navigationPromise1 = page.waitForNavigation({timeout: 300000, waitUntil: 'domcontentloaded'});
  await clickElement(editButton);
  await navigationPromise1;
  console.log("loaded");
}
