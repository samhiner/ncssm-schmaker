function addRow() {
	var firstRow = document.getElementById('mainTable').firstElementChild;
	var table = document.getElementById('mainTable')

	var cloneRow = firstRow.cloneNode(true);
	cloneRow.children[0].firstElementChild.value = '';
	cloneRow.children[1].firstElementChild.value = '';
	cloneRow.children[2].firstElementChild.value = '';
	table.insertBefore(cloneRow, document.getElementById('tableControls'))
	//console.log(cloneRow.children[1].first)
}

function getConflicts() {
	var classChoices = [];
	window.classNumbers = {'300': 0, '350': 0, '400': 0};
	var classCode;
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

	$.ajax({
		url: 'https://script.google.com/macros/s/AKfycbwHjug6DYFyefmbRotIRbnTktIBCUGFXf0wBq9krkbxcxU0Dys0/exec?t1=' + classChoices[0] + '&t2=' + classChoices[1] + '&t3=' + classChoices[2],
		dataType: 'jsonp'
	});
}

function deleteRow() {
	var tableControls = document.getElementById('tableControls')
	if (tableControls.previousElementSibling.previousElementSibling != null) {
		tableControls.parentNode.removeChild(tableControls.previousElementSibling);
	}
}

function addResults(conflicts/*, tri1Times, tri2Times, Tri3Times*/) {
	conflictOutputs = document.getElementById('conflictArea').childNodes;
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
}

function updateGPA() {
	
}