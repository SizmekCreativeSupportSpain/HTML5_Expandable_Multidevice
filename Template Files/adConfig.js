var adConfig = {
    "contracted_width": "300",
    "contracted_height": "250"
};

////////Funciones comunes, NO ELIMINAR!!!!!!!!////////////////////

function checkIfAdKitReady(event) {
	adkit.onReady(startAd);
}

function isTouchDevice()
{
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	//return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
}

window.addEventListener("load", checkIfAdKitReady);

///////////////////////////////////////////////////////////////////