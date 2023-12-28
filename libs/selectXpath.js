export default async function selectXpath(path, page){
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