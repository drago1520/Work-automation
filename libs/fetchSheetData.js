import axios from "axios";
import "dotenv/config";

export default async function fetchSheetData2D(spreadSheetID) {
  const spreadsheetId = spreadSheetID;
  const sheetName = 'Sheet1';
  const SheetsAPIFacebook = process.env.GOOGLE_SHEET_API_FACEBOOK;
  const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${SheetsAPIFacebook}`;
  let response = [];
  
  try {
    response = await axios.get(apiUrl);

    //flatArrayURL = response.data.values.flat();
    
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
  }
  const sheet2D = response.data.values;
  return sheet2D;
}