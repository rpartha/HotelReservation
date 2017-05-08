var auth2;

function onSignIn(googleUser) {
	localStorage.removeItem("tokenId");
	localStorage.setItem("tokenId", googleUser.getAuthResponse().id_token);
	$.post('./user', {tokenId: googleUser.getAuthResponse().id_token}, function(data){
		if (data.email == 'admin@admin.com'){
			window.location.replace('./admin.html');
		} else if (!data.registered){
			window.location.replace('./signup.html');
		} else {
			window.location.replace('./dashboard.html');
		}
	});
}

$("#form").submit(function(eventObj){
	$(this).append('<input type="hidden" name="tokenId" value="' + localStorage.getItem("tokenId") + '"/>');
    return true;
})