window.onload = function() {
	
	console.log('am I crazy here???');

	var id = document.getElementById('hidden-id').value;
	console.log('id ' + id)
	
	if ($('#delete').length != 0) {	

		var redirect = window.location.href.substring(0, window.location.href.lastIndexOf('/'))

		console.log(redirect)

		$('#delete').click(function() {
			$.ajax({
				url: window.location.href.replace('view', 'api'),
				type: 'DELETE',
				success: function(r) {window.location.href = redirect},
				error: function(r) {$('#unknown').removeClass('hidden')}
			}) 
			//ajax.send(JSON.stringify({name: 'bryce', description: 'a description lol'}));
		})
	}

	if ($('#update').length != 0) {	
		$('#update').click(function(e) {
			var incomplete = false
			$.each($('input'), function(i, val) {
				if($(val).val().length === 0 ) {
					$('#incomplete').removeClass('hidden')
					incomplete = true;
				}
			});

			if (incomplete) return;

			var data = $('form').serialize();
			console.log(data)
			
			$.ajax({
				url: window.location.href.replace('view', 'api'),
				type: 'PUT',
				success: function(r) {location.reload()},
				error: function(r) {console.log(r)},
				data: data
			});
		});
	}

	if ($('#post').length != 0) {
		
		$('#post').click(function(e) {
			var incomplete = false
			$.each($('input'), function(i, val) {
				if($(val).val().length === 0 ) {
					$('#incomplete').removeClass('hidden')
					incomplete = true;
				}
			});

			if (incomplete) return;

			var data = $('form').serialize();
			$.ajax({
				url: window.location.href.replace('view', 'api'),
				type: 'POST',
				success: function(r) {location.reload()},
				error: function(r) {console.log(r)},
				data: data
			});
		});
	}
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