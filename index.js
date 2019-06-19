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
	var tableControls = document.getElementById('tableControls')
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

	perWeekStats(times);
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
		}
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