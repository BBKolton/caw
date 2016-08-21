window.addEventListener('load', function() {
	var loginEmail = document.getElementById('loginEmail');
	var loginPass = document.getElementById('loginPass');
	var loginSubmit = document.getElementById('loginSubmit');

	var emailReady = false;
	var passReady = false;

	console.log('herp der der')

	loginEmail.onkeyup = emailCheck;

	function emailCheck() {
		console.log('hey')
		if (loginEmail.value.indexOf('@') != -1)
			emailReady = true;
		else
			emailReady = false;
		checkButton();					
	}

	loginPass.onkeyup = passCheck;

	function passCheck() {
		console.log('hey')
		if (loginPass.value.length != 0)
			passReady = true;
		else
			passReady = false;
		checkButton();			
	}

	function checkButton() {
		if (passReady && emailReady)
			loginSubmit.classList.remove('disabled')
		else
			loginSubmit.classList.add('disabled')
	}



	var inputs = document.getElementById('registerForm').elements
	for (i in inputs) {
		inputs[i].onkeyup = checkRegister;
	}

	function checkRegister() {
		if (inputs[0].value.indexOf('@') != -1 
		&&  inputs[1].value.length >= 10
		&&  inputs[2].value.length >= 1
		&&  inputs[3].value.length >= 1
		&&  inputs[4].value.length >= 10 ) 
			document.getElementById('registerSubmit').classList.remove('disabled')
		else
			document.getElementById('registerSubmit').classList.add('disabled')
	}




})