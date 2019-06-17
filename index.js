function addRow() {
	var firstRow = document.getElementById('mainTable').firstElementChild;
	var table = document.getElementById('mainTable')

	var cloneRow = firstRow.cloneNode(true);
	cloneRow.firstElementChild.firstElementChild.value = '';
	table.insertBefore(cloneRow, document.getElementById('tableControls'))
}

/* will use console.log(document.getElementsByName('classChoice')[x].value);


function updateFormatWrapper(element) {

	var args = ;

	$.ajax({
		url: 'https://script.google.com/macros/s/AKfycbyPdkk_VoJjlOolZChvmekYU70SHgDJy73Vn8PBDHR5Zl-UvuV9/exec?request=' + args,
		dataType: 'jsonp'
	});
}*/