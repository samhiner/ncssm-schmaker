function addRow() {
	var firstRow = document.getElementById('mainTable').firstElementChild;
	var table = document.getElementById('mainTable')

	var cloneRow = firstRow.cloneNode(true);
	cloneRow.firstElementChild.firstElementChild.value = '';
	table.insertBefore(cloneRow, document.getElementById('tableControls'))
}

function getConflicts() {
	var classChoices = '' 
	var classChoiceInputs = document.getElementsByName('classChoice');
	for (var x = 0; x < classChoiceInputs.length; x++) {
		//get the first word- the class code- of each selected class
		classChoices += classChoiceInputs[x].value.split(' ')[0] + ';'
	}


	$.ajax({
		url: 'https://script.google.com/macros/s/AKfycbwHjug6DYFyefmbRotIRbnTktIBCUGFXf0wBq9krkbxcxU0Dys0/exec?classes=' + classChoices,
		dataType: 'jsonp',
		success: function(result) {
			alert(result)
			console.log(result)
		}
	});
}