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
	for (var x = 0; x < classChoices.length; x++) {
		//get the first word- the class code- of each selected class
		classChoices += classChoiceInputs[x].value.split(' ')[0] + ';'
	}

	$.ajax({
		url: 'https://script.google.com/macros/s/AKfycbyPdkk_VoJjlOolZChvmekYU70SHgDJy73Vn8PBDHR5Zl-UvuV9/exec?classes=' + classChoices,
		dataType: 'jsonp'
	});
}*/