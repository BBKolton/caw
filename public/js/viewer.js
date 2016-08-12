window.onload = function() {
	
	console.log('am I crazy here???');

	var id = document.getElementById('id').value;
	console.log('id ' + id)
	
	document.getElementById('delete').onclick = function() {
		var ajax = new XMLHttpRequest();
		ajax.open("DELETE", "/api/series/" + id, true);
		ajax.setRequestHeader("Content-type", "application/json; charset=utf-8");
		ajax.data = {}
		ajax.onreadystatechange = function() {console.log(ajax.response)}
		ajax.send();
		//ajax.send(JSON.stringify({name: 'bryce', description: 'a description lol'}));
	}
}