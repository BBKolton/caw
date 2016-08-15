window.onload = function() {
	
	console.log('am I crazy here???');

	var id = document.getElementById('id').value;
	console.log('id ' + id)
	
	document.getElementById('delete').onclick = function() {
		var ajax = new XMLHttpRequest();
		ajax.open("DELETE", window.location.href.replace('view', 'api'), true);
		ajax.setRequestHeader("Content-type", "application/json; charset=utf-8");
		ajax.data = {}
		ajax.onreadystatechange = function() {console.log(ajax.response)}
		ajax.send();
		//ajax.send(JSON.stringify({name: 'bryce', description: 'a description lol'}));
	}

	$('#update').click(function(e) {
		var data = $('form').serialize();
		console.log('omg pls')
		$.ajax({
			url: window.location.href.replace('view', 'api'),
			type: 'PUT',
			success: function(r) {console.log(r)},
			error: function(r) {console.log(r)},
			data: data
		});
	});
}

// 	document.getElementById('update').onclick = function() {

// 		var form = document.getElementById('form')
// 		var formdata = new FormData(form)
// 		console.log(formdata)

// 		var ajax = new XMLHttpRequest();
// 		ajax.open("PUT", window.location.href.replace('view', 'api'), true);
// 		ajax.setRequestHeader("Content-type", "application/json; charset=utf-8");
// 		ajax.data = new FormData(document.getElementById('form'));
// 		console.log(ajax.data);
// 		ajax.onreadystatechange = function() {console.log(ajax.response)}
// 		ajax.send(ajax.data);
// 	}
// }