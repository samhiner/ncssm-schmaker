function addRow(num = 1) {
	var firstRow = document.getElementById('mainTable').firstElementChild;
	var table = document.getElementById('mainTable')
	var cloneRow;

	for (var x = 0; x < num; x ++) {
		cloneRow = firstRow.cloneNode(true);
		cloneRow.children[0].firstElementChild.value = '';
		cloneRow.children[1].firstElementChild.value = '';
		cloneRow.children[2].firstElementChild.value = '';
		table.insertBefore(cloneRow, document.getElementById('tableControls'))
	}
}

function getConflicts() {
	var classChoices = [];
	window.classNumbers = {'300': 0, '350': 0, '400': 0};
	var classCode;

	//collect data aboput the classes that the user inputted
	for (var tri = 1; tri <= 3; tri++) {
		var triChoices = ''
		var classChoiceInputs = document.getElementsByName('tri' + tri + 'Choice');
		for (var x = 0; x < classChoiceInputs.length; x++) {
			//get the first word- the class code- of each selected class
			if (classChoiceInputs[x].value != '') {
				classCode = classChoiceInputs[x].value.split(' ')[0]
				triChoices += classCode + ';';

				if (classCode[2] == '3' && Number(classCode[3]) < 5) {
					window.classNumbers['300'] += 1;
				} else if (classCode[2] == '3') {
					window.classNumbers['350'] += 1;
				} else if (classCode[2] == '4') {
					window.classNumbers['400'] += 1;
				}
			}
		}
		classChoices.push(triChoices)
	}

	localStorage.setItem('inputtedClasses', classChoices);

	document.getElementById('loadingBackground').style.display = 'block';
	document.getElementById('loadingScreen').style.display = 'block';

	$.ajax({
		url: 'https://script.google.com/macros/s/AKfycbwHjug6DYFyefmbRotIRbnTktIBCUGFXf0wBq9krkbxcxU0Dys0/exec?t1=' + classChoices[0] + '&t2=' + classChoices[1] + '&t3=' + classChoices[2],
		dataType: 'jsonp'
	});

	var gradeInputs = document.getElementsByName('gradeInput');

	gradeInputs[0].disabled = false;
	gradeInputs[1].disabled = false;
	gradeInputs[2].disabled = false;
	gradeInputs[0].value = window.classNumbers['300'] + window.classNumbers['350'] + window.classNumbers['400'];
	updateGPA();
}

function deleteRow() {
	var tableControls = document.getElementById('tableControls');
	if (tableControls.previousElementSibling.previousElementSibling != null) {
		tableControls.parentNode.removeChild(tableControls.previousElementSibling);
	}
}

function addResults(conflicts, times) {
	document.getElementById('loadingScreen').style.display = 'none';
	document.getElementById('loadingBackground').style.display = 'none';

	var conflictOutputs = document.getElementById('conflictArea').childNodes;
	for (var x = 0; x < 3; x++) {
		if (conflicts[x] == "true") {
			// * 2 + 1 factors in for text elements
			conflictOutputs[x * 2 + 1].style.backgroundColor = 'lightgreen';
			conflictOutputs[x * 2 + 1].innerText = 'No Conflict';
		} else if (conflicts[x] == "false") {
			conflictOutputs[x * 2 + 1].style.backgroundColor = '#ee9090';
			conflictOutputs[x * 2 + 1].innerText = 'Conflict';
		} else {
			conflictOutputs[x * 2 + 1].style.backgroundColor = '#eed390';
			conflictOutputs[x * 2 + 1].innerText = 'Conflict Unknown';
		}
	}

	perWeekStats(times.slice(0));
	updateCalendar(times.slice(0));
}

function updateGPA() {
	var numGrades = 0;
	var gradeInputs = document.getElementsByName('gradeInput')
	var totalClasses = window.classNumbers['300'] + window.classNumbers['350'] + window.classNumbers['400'];

	for (var x = 0; x < 3; x++) {
		numGrades += Number(gradeInputs[x].value);
	}

	if (totalClasses == numGrades) {
		document.getElementById('avgGPA').innerHTML = ((window.classNumbers['300'] * 4.5 + window.classNumbers['350'] * 4.75 + window.classNumbers['400'] * 5 - gradeInputs[1].value - gradeInputs[2].value * 2) / totalClasses).toFixed(4);
	} else {
		document.getElementById('avgGPA').innerHTML = 'You have ' + totalClasses + ' classes but ' + numGrades + ' grades.'
	}
}

function accessLocalStorage() {
	if (localStorage.getItem('inputtedClasses') != null) {
		var classes = localStorage.getItem('inputtedClasses').split(',')
		var triClasses;
		var triInputs;
		for (x in classes) {
			triClasses = classes[x].split(';').slice(0, -1);
			triInputs = document.getElementsByName('tri' + String(Number(x) + 1) + 'Choice');

			if (triClasses.length > triInputs.length) {
				addRow(triClasses.length - triInputs.length);
				triInputs = document.getElementsByName('tri' + String(Number(x) + 1) + 'Choice');
			}

			for (y in triClasses) {
				triInputs[y].value = $('option[value*="' + triClasses[y] + '"').val();
				if (triInputs[y].value == 'undefined') {
					triInputs[y].value = '';
				}
			}
		}
	}

	if (localStorage.getItem('keyOrder') != null && localStorage.getItem('times') != null && localStorage.getItem('colors') != null) {
		window.keyOrder = localStorage.getItem('keyOrder').split(',');
		window.times = JSON.parse(localStorage.getItem('times'));
		window.colors = localStorage.getItem('colors').split(',')
		console.log(window.keyOrder)
		console.log(window.times)
		console.log(window.colors)
		endCalendarQuestions();
	}
}

function perWeekStats(times) {
	var minutesPerWeek;
	var classesPerWeek;
	var classSchedule;

	var timeOutput = document.getElementById('timePerWeek');
	var classOutput = document.getElementById('classesPerWeek');

	timeOutput.innerHTML = '';
	classOutput.innerHTML = '';
	for (var tri = 0; tri < 3; tri++) {
		if (document.getElementById('conflictArea').childNodes[tri * 2 + 1].innerText == 'Conflict Unknown') { //this means "if conflict unknown"
			continue;
		}
		minutesPerWeek = 0;
		classesPerWeek = 0;
		for (key in times[0]) {
			classSchedule = times[0][key][0]
			for (x in classSchedule) {
				if (classSchedule[x] == 'L') {
					minutesPerWeek += 40;
				} else if (!isNaN(classSchedule[x])) {
					classesPerWeek += 1;
					minutesPerWeek += 50;
				}
			}
		}
		times.shift();
		timeOutput.innerHTML += 'T' + (Number(tri) + 1) + ': ' + Math.floor(minutesPerWeek / 60) + 'h ' + (minutesPerWeek % 60) + 'm';
		classOutput.innerHTML += 'T' + (Number(tri) + 1) + ': ' + classesPerWeek + ' classes';

		if (tri != 2) {
			timeOutput.innerHTML += ', ';
			classOutput.innerHTML += ', ';
		}
	}
	
}

function updateCalendar(times) { //TODO theres no point of this function. find references and fix.
	setupCalendarQuestions(times)
}

function setupCalendarQuestions(times) {
	document.getElementById('qWrapper').style.display = 'block';

	window.times = times;

	window.qNum = 1;
	window.colors = []
	
	enterQuestion(['Trimester 1', 'Trimester 2', 'Trimester 3'])
}

function getCalendarQuestions(answer, num) {
	if (window.qNum == 1) {
		var answer = document.querySelector('input[name="scheduleQ"]:checked').value;
		var blankConstant = 1;
		if (document.getElementById('conflictArea').childNodes[1].innerText == 'Conflict Unknown') { //this means "if conflict unknown"
			blankConstant++;
			if (document.getElementById('conflictArea').childNodes[3].innerText == 'Conflict Unknown') { //this means "if conflict unknown"
				blankConstant++;
			}
		}
		window.times = window.times[Number(answer.substr(-1)) - blankConstant];
		window.keyOrder = Object.keys(window.times);
	} else {
		var selectedOption = document.querySelector('input[name="scheduleQ"]:checked').value;
		window.times[window.keyOrder[window.qNum - 2]] = selectedOption;
		window.colors.push(document.getElementById('courseColor').value)
	}
	window.qNum++;
	var nextQArr = window.times[window.keyOrder[window.qNum - 2]]
	if (nextQArr != undefined) {
		enterQuestion(nextQArr)
	} else {
		endCalendarQuestions();
		return;
	}
}

function enterQuestion(qArr) {
	var colorPalette = ['#00FFFF', '#FF0000', '#FFFF00', '#00FF00', '#FF00FF', '#FF8C00', '#800000', '#4B0082']

	document.getElementById('qArea').innerHTML = '';

	if (qArr[0] == 'Trimester 1') {
		document.getElementById('qArea').innerHTML += 'Which trimester do you want a calendar for?<br>';
		for (x in qArr) {
			document.getElementById('qArea').innerHTML += '<input type="radio" name="scheduleQ" value="' + qArr[x] + '"' + (document.getElementById('t' + qArr[x].substr(-1) + 'ConflictDisplay').innerText != 'No Conflict' ? 'disabled' : '') + '>' + qArr[x] + '</option><br>';
		}
	} else {
		document.getElementById('qArea').innerHTML += 'Choose when you are taking ' + window.keyOrder[window.qNum - 2] + '. Also, choose the color you want for that course <input id="courseColor" type="color" value="' + colorPalette[(window.qNum - 2) % colorPalette.length] + '"><br>';
		for (x in qArr) {
			document.getElementById('qArea').innerHTML += '<input type="radio" name="scheduleQ" value="' + qArr[x] + '">' + qArr[x] + '</option><br>';
		}
	}



	document.getElementById('qArea').innerHTML += '</select>';
}

function endCalendarQuestions() {
	document.getElementById('qWrapper').style.display = 'none';

	var currClass;
	var currBlock;
	var char;
	var meetingDay;
	var meetingTime;

	window.schedule = []

	localStorage.setItem('keyOrder', window.keyOrder);
	localStorage.setItem('times', JSON.stringify(window.times));
	localStorage.setItem('colors', window.colors);

	for (x in window.keyOrder) {
		currClass = window.times[window.keyOrder[x]]
		for (var y in currClass) {
			char = currClass[y]
			console.log(currBlock + char)
			if (!isNaN(char) || char == 'L') {
				document.getElementById(currBlock + char).style.backgroundColor = window.colors[x];
				if (document.getElementById(currBlock + char).previousElementSibling.className == 'time') {
					document.getElementById(currBlock + char).previousElementSibling.style.backgroundColor = window.colors[x];
					document.getElementById(currBlock + char).previousElementSibling.previousElementSibling.style.backgroundColor = window.colors[x];
					console.log()
					if (char != 'L') {
						if (currClass[Number(y) + 1] == 'L' || ['12:55 to 2:25', '10:45 to 12:15'].indexOf(document.getElementById(currBlock + char).previousElementSibling.innerText) == -1) { //last one means if this isn't a lab block
							meetingTime = document.getElementById(currBlock + char).previousElementSibling.innerText;
						} else {
							meetingTime = document.getElementById(currBlock + char).previousElementSibling.innerText.split(' ');
							meetingTime = meetingTime[0] + ' ' + meetingTime[1] + ' ' + timeCalc(meetingTime[2], -40)
						}
					}
				} else if (char != 'L') { //you never have an L on its own so we don't need a condition for coloring just a lab block
					document.getElementById(currBlock + 'L').previousElementSibling.style.backgroundColor = window.colors[x];
					document.getElementById(currBlock + 'L').previousElementSibling.previousElementSibling.style.backgroundColor = window.colors[x];

					if (currClass[Number(y) + 1] == 'L') {
						meetingTime = document.getElementById(currBlock + 'L').previousElementSibling.innerText;
					} else {
						meetingTime = document.getElementById(currBlock + 'L').previousElementSibling.innerText.split(' ');
						console.log(meetingTime)
						meetingTime = timeCalc(meetingTime[0], 40) + ' ' + meetingTime[1] + ' ' + meetingTime[2]
						console.log(meetingTime)
					}
				}

				if (char != 'L') {
					window.schedule.push([char, meetingTime, window.keyOrder[x]])
				}
			} else {
				currBlock = char;
			}
		}
	}
}


function timeCalc(time, modifier) {
	console.log(time)

	time = time.split(':');
	time[0] = Number(time[0]);
	time[1] = Number(time[1]);

	time[0] += Math.floor((modifier + time[1]) / 60);
	if (time[0] == 0) {
		time[0] = 12;
	}

	time[1] = (modifier + time[1]) % 60;
	console.log(time[1])
	if (time[1] < 0) {

		time[1] += 60;
	}

	if (time[1] >= 10) {
		console.log(time[0] + ':' + time[1])
		return time[0] + ':' + time[1];
	} else {
		console.log(time[0] + ':0' + time[1])
		return time[0] + ':0' + time[1];
	}
}

function insertClasses() {
	var times;
	var batch = gapi.client.newBatch();
	for (var x in window.schedule) {
		
		times = window.schedule[x][1].split(' ');
		if (times[0] == '8:05' || (Number(times[0].split(':')[0]) <= 6)) {
			times[0] = times[0].split(':');
			times[0] = String(Number(times[0][0]) + Number(12)) + ':' + times[0][1];

			if (times[0].length == 4) {
				times[0] = '0' + times[0]
			}
		}

		if ((times[2] == '9:45' && times[0] == '20:05') || (Number(times[2].split(':')[0]) < 8)) {
			times[2] = times[2].split(':');
			times[2] = String(Number(times[2][0]) + Number(12)) + ':' + times[2][1];

			if (times[2].length == 4) {
				times[2] = '0' + times[2]
			}
		}
		batch.add(insertMeeting(window.schedule[x][0], times[0], times[2], window.schedule[x][2]));
	}
	
	batch.then(function(event) {
		console.log('Classes added to Google Calendar.');
	});

}

function insertMeeting(startWeekDay, start, end, name) {
	var starts = {1: 19, 2: 20, 3: 21, 4: 15, 5: 16};

	var event = {
		'summary': name,
		'start': {
			'dateTime': '2019-08-' + String(starts[startWeekDay]) + 'T' + start + ':00-04:00',
			'timeZone': 'America/New_York'
		},
		'end': {
			'dateTime': '2019-08-' + String(starts[startWeekDay]) + 'T' + end + ':00-04:00',
			'timeZone': 'America/New_York'
		},
		'recurrence': [
			'RRULE:FREQ=WEEKLY;COUNT=' + (startWeekDay == 4 ? String(12) : String(11))
		],
		'reminders': {
			'useDefault': false,
			'overrides': [
				{
					'method': 'popup',
					'minutes': 10
				}
			]
		}
	};

	console.log(event)

	return gapi.client.calendar.events.insert({
		'calendarId': 'primary',
		'resource': event
	});

	

}