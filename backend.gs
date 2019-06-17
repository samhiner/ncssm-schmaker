SHEET_ID = '1Wv4XzU5aIEemGKYjoCBuCKjNQEIcaHvNHPspVl7hxkw'

function doGet(/*request*/) {
  //var classes = request['parameter']['classes'].split(';')
  
  
  var spreadsheet = SpreadsheetApp.openById(SHEET_ID)
  //the 0 index is the first sheet, or tri 1
  var sheet = spreadsheet.getSheets()[0];
  var data = sheet.getDataRange().getValues();
  
  /*var classTimes = {};
  for (x in classes) {
    classTimes[classes[x]] = [];
  }*/
  var classTimes = {'BI434': []};
  
  for (row in data) {
    var classCode = data[row][0].split(' ')[0]
    if (['BI434'].indexOf(classCode) != -1) {
      classTimes[classCode].push(data[row][1])
    }
  }
  
  //conflict calculator
  
}
