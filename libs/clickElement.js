export default async function clickElement(element){
   
  if(element){
    await element.click();
  }else{
    console.log('Element not found in clickElement()');
  }
}
//
