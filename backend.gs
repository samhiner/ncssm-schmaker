SHEET_ID = '1Wv4XzU5aIEemGKYjoCBuCKjNQEIcaHvNHPspVl7hxkw'
DIGITS = ['1', '2', '3', '4', '5'];

function doGet(/*request*/) {
  //var classes = request['parameter']['classes'].split(';')
  var classes = ['BI434', 'MA470'];
  
  var spreadsheet = SpreadsheetApp.openById(SHEET_ID)
  //the 0 index is the first sheet, or tri 1
  var sheet = spreadsheet.getSheets()[0];
  var data = sheet.getDataRange().getValues();
  
  var allClassTimes = {};
  for (x in classes) {
    allClassTimes[classes[x]] = [];
  }
  
  for (row in data) {
    var classCode = data[row][0].split(' ')[0]
    if (classes.indexOf(classCode) != -1) {
      allClassTimes[classCode].push(data[row][1])
    }
  }

  //conflict calculator
  /*TODO if you want1: fill in required spots for 1-class courses
    2: lay out all options for remaining classes and if you have an open class with no potential conflicts resolve yourself there
    3: 
  */
  
  classTimesList = [];
  for (var key in allClassTimes) {
    classTimesList.push(allClassTimes[key]);
  }

  //thx find and replace -- theres got to be a better way to do that
  var calendar = {'A': [false, false, false, false, false], 'B': [false, false, false, false, false], 'C': [false, false, false, false, false], 'D': [false, false, false, false, false], 'E': [false, false, false, false, false], 'F': [false, false, false, false, false], 'G': [false, false, false, false, false], 'H': [false, false, false, false], 'I': [false, false, false, false]};
  Logger.log(conflictCalculator(classTimesList, calendar))
}


function conflictCalculator(allClassTimes, calendar) {
  if (allClassTimes == []) {
    return true;
  }

  var possTimes = allClassTimes[0];
  for (x in possTimes) {
    Logger.log(calendar);
    var scheduleAttempt = trySchedule(possTimes[x], JSON.parse(JSON.stringify(calendar)));
    Logger.log(calendar);
    if (scheduleAttempt != false) {
      if (conflictCalculator(allClassTimes.slice(1), scheduleAttempt)) {
        return true;
      }
    }
  }

  return false;
}

function trySchedule(classTime, calendar) {
  var blockChar;
  for (var x = 0; x < classTime.length; x++) {
    if (DIGITS.indexOf(classTime[x]) != -1) {
      if (calendar[blockChar][classTime[x] - 1] == true) {
        return false;
      } else {
        calendar[blockChar][classTime[x] - 1] = true;
      }
    } else if (classTime[x] == 'L') { //labs don't matter bc A2 and A2L still conflict and Ls don't reach into other blocks
      continue;
    } else {
      blockChar = classTime[x];
    }
  }
  return calendar;
}