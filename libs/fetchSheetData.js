//const urls = await fetchSheetData(spreadSheetID);
async function fetchSheetData(spreadSheetID) {
  const spreadsheetId = spreadSheetID;
  const sheetName = 'Sheet1';
  const SheetsAPIFacebook = process.env.GOOGLE_SHEET_API_FACEBOOK;
  const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${SheetsAPIFacebook}`;
  let flatArrayURL = [];
  
  try {
    const response = await axios.get(apiUrl);
    
    flatArrayURL = response.data.values.flat();
    
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
  }
  return flatArrayURL;
}