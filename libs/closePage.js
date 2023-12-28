export default async function closePage (){
  try{
    await page.close();
  }catch(e){
    console.log(e);
  }
}  