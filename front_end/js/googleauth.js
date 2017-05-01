function onSignIn(googleUser) {
	$.post('./user', {tokenId: googleUser.getAuthResponse().id_token}, function(data){
		console.log(data);
		if (data.email == 'admin@admin.com'){
			window.location.replace('./admin.html');
		} else if (!data.registered){
			window.location.replace('./signup.html');
		} else {
			window.location.replace('./dashboard.html');
		}
	});
}