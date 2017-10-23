var adConfig = {
    "contracted_width": "300px",
    "contracted_height": "250px",
    "mobile_expanded_with": "320px",
    "mobile_expanded_height": "480px",
    "desktop_expanded_with": "800px",
    "desktop_expanded_height": "600px",
    "autoPlayVideos": false
};

////////Funciones comunes, NO ELIMINAR!!!!!!!!//////////////////////

function checkIfAdKitReady(event) {
	adkit.onReady(startAd);
}

function isTouchDevice()
{
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	//return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
}

window.addEventListener("load", checkIfAdKitReady);

/////////////////////////////////////////////////////////////////////