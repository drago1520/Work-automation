async function clickElement(element){
  console.log(element);
  if(element){
    await element.click();
  }else{
    console.log('Element not found in clickElement()');
  }
}
export default clickElement;