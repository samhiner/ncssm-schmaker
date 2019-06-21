SHEET_ID = '1Wv4XzU5aIEemGKYjoCBuCKjNQEIcaHvNHPspVl7hxkw'
DIGITS = ['1', '2', '3', '4', '5'];

function doGet(request) {
  /*var request = {'parameter': 
                 {'t1': 'AS405a;SP307a;PH401a;MA466;BI364;RE102;',
                  't2': 'AS405b;SP307b;PH401b;MA458;IE450;PA162;',
                  't3': 'AS405c;SP307c;MA472;MA468;MA476;RE122;MA460;'}
                }*/
  
  var conflictBools = [];
  var classLists = [];
  var results;
  for (var x = 1; x <= 3; x++) {
    if (request['parameter']['t' + String(x)] != '' && request['parameter']['t' + String(x)] != undefined) {
      results = scheduleHandler(request['parameter']['t' + String(x)].split(';').slice(0, -1), x)
      conflictBools.push(results[0]);
      classLists.push(results[1]);
    } else {
      conflictBools.push('unknown');
    }
  }
  return ContentService.createTextOutput('addResults(["' + conflictBools.join('", "') + '"], ' + JSON.stringify(classLists) + ');').setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function scheduleHandler(classes, tri) {
  var spreadsheet = SpreadsheetApp.openById(SHEET_ID)
  //the 0 index is the first sheet, or tri 1
  var sheet = spreadsheet.getSheets()[tri - 1];
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
  
  Logger.log(allClassTimes);
  //conflict calculator
  /*TODO if you want1: fill in required spots for 1-class courses
    2: lay out all options for remaining classes and if you have an open class with no potential conflicts resolve yourself there
    3: 
  */
  
  classTimesList = [];
  for (var key in classes) {//this gets duplicates as it pulls from same spot on dict twice
    classTimesList.push(allClassTimes[classes[key]]);
  }

  Logger.log(classTimesList);
  
  classTimesList.sort(function(a, b) {
    if (a.length > b.length) {
      return 1;
    } else if (a.length == b.length) {
      return 0;
    } else {
      return -1;
    }
  });
  
  //thx find and replace -- theres got to be a better way to do that
  var calendar = {'A': [false, false, false, false, false], 'B': [false, false, false, false, false], 'C': [false, false, false, false, false], 'D': [false, false, false, false, false], 'E': [false, false, false, false, false], 'F': [false, false, false, false, false], 'G': [false, false, false, false, false], 'H': [false, false, false, false], 'I': [false, false, false, false]};
  
  return [conflictCalculator(classTimesList, calendar), allClassTimes];
}

function conflictCalculator(allClassTimes, calendar) {
  var possTimes = allClassTimes[0];
  for (x in possTimes) {
    var scheduleAttempt = trySchedule(possTimes[x], JSON.parse(JSON.stringify(calendar)));
    Logger.log('---Current calendar and remaining class times to schedule.');
    Logger.log(calendar);
    Logger.log(allClassTimes);
    Logger.log('---Potential time to schedule from first remaining class and whether it was scheduled.');
    Logger.log(possTimes[x])
    Logger.log(scheduleAttempt !== false);
    if (scheduleAttempt !== false) {
      Logger.log('Recursion depth increased!');
      if (allClassTimes.length == 1 || conflictCalculator(allClassTimes.slice(1), scheduleAttempt)) {
        return true;
      }
    }
  }

  Logger.log('Recursion depth decreased.');
  return false;
}

function trySchedule(classTime, calendar) {
  var blockChar;
  for (var x = 0; x < classTime.length; x++) {
    if (DIGITS.indexOf(classTime[x]) != -1) {
      
      //this accounts for classes with variable blocks like M
      if (calendar[blockChar] == undefined) {
        calendar[blockChar] = [false, false, false, false, false];
      }
      
      if (calendar[blockChar][classTime[x] - 1] == true) {
        return false;
      } else {
        calendar[blockChar][classTime[x] - 1] = true;
      }
    } else if (classTime[x] == 'L') { //labs don't matter bc A2 and A2L still conflict and Ls don't reach into other blocks
      continue;
    } else {
      blockChar = classTime[x]; //if there are no numbers in a schedule, like VS or N/A, it isn't scheduled.
    }
  }
  return calendar;
}