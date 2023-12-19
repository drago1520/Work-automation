//steps: https://chat.openai.com/share/8e658505-c691-40c6-945f-e601893eb041
function highlightCommonUrls() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Replace 'Sheet1' and 'Sheet2' with the actual names of your sheets
  var sheet1 = ss.getSheetByName('Sheet1');
  var sheet2 = ss.getSheetByName('Sheet2');

  // Adjust the ranges according to where your URLs are located
  var urls1 = sheet1.getRange('A1:A').getValues(); // Assuming URLs are in column A
  var urls2 = sheet2.getRange('A1:A').getValues();

  var flatUrls2 = urls2.flat(); // Flatten the array for easier searching

  urls1.forEach(function(row, index) {
    if (flatUrls2.includes(row[0])) {
      // Change 'A' to the column where your URLs are
      sheet1.getRange('A' + (index + 1)).setBackground('green');
    }
  });
}
