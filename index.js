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
	var classChoices = []
	for (var tri = 1; tri <= 3; tri++) {
		var triChoices = '' 
		var classChoiceInputs = document.getElementsByName('tri' + tri + 'Choice');
		for (var x = 0; x < classChoiceInputs.length; x++) {
			//get the first word- the class code- of each selected class
			if (classChoiceInputs[x].value != '') {
				triChoices += classChoiceInputs[x].value.split(' ')[0] + ';'
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

function addResults() {
	//<td style='background-color: lightgreen;'>Conflict</td>
	//<td style='background-color: #ee9090;'>No Conflict</td>
}