var localPreview = false;
try {
	localPreview = document.location === top.location;
}
catch (e) {}

function initializeLocalPreview() {
	var ua = navigator.userAgent;
	EB = {
		_adConfig: {
			adId: 0,
			rnd: 0,
			uid: 0
		},
		API: {
			os: {
				ios: ua.match(/ipod|iphone|ipad/i) !== null
			}
		},
		getSDKData: function() {
			return null;
		},
		clickthrough: function() {
			return true;
		},
		automaticEventCounter: function() {
			return true;
		},
		userActionCounter: function() {
			return true;
		},
		_sendMessage: function() {
			return true;
		},
		expand: function(data) {
			console.log('Expand',data);
			return true;
		},
		getCustomVars: function() {
			return true;
		}
	};
	EBG = {
		VideoModule: function(video) {
			return {
				_videoElement: video,
				playVideo: function() {
					this._videoElement.play();
				}
			};
		}
	};
	var visibilityStyle = document.createElement("style");
	visibilityStyle.innerHTML = "html, body, div, video {visibility: visible !important;}";
	document.getElementsByTagName("head")[0].appendChild(visibilityStyle);
}