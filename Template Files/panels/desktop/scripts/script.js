/*******************
VARIABLES
*******************/
var closeBtn, clickBtn, bannerContainer, video, audioButton, controlButton;
var adId;
var rnd;
var uid;

/*******************
INITIALIZATION
*******************/

function startAd() {
    try { //try/catch just in case localPreview.js is not included
        if (window.localPreview) {
            window.initializeLocalPreview(); //in localPreview.js
        }
    }
    catch (e) {}
    initializeGlobalVariables(); 
    initializeVideoTracking();
    bannerContainer.style.display = 'block';
}

function initializeGlobalVariables() {
    adId = EB._adConfig.adId;
    rnd = EB._adConfig.rnd;
    uid = EB._adConfig.uid;

    closeBtn = document.getElementById("closeBtn");
    clickBtn = document.getElementById("clickBtn");
    bannerContainer = document.getElementById("banner");
    video = document.getElementById("video");
    audioButton = document.getElementById("audioButton");
    controlButton = document.getElementById("controlButton");

    closeBtn.addEventListener("click", handleCloseButtonClick);
    clickBtn.addEventListener("click", handleClickthroughButtonClick);

    var mql = window.matchMedia("(orientation: landscape)");
    handleOrientation(mql);
    mql.addListener(function(m) {
        handleOrientation(m);
    });

}

/*******************
EVENT HANDLERS
*******************/
function handleCloseButtonClick() {
    setTimeout(function() {
        if (EB.API.os.mobile) {
            enablePageScrolling();
        }
        EB.collapse();
    }, 200);
}
function handleOrientation(m) {
    if(m.matches) {
        bannerContainer.style.width = adConfig.desktop_expanded_with;
        bannerContainer.style.height = adConfig.desktop_expanded_height;
    }
    else {
        bannerContainer.style.width = adConfig.desktop_expanded_height;
        bannerContainer.style.height = adConfig.desktop_expanded_with;
    }
}

function initializeVideoTracking() {
    videoTrackingModule = new EBG.VideoModule(video);

    controlButton.addEventListener("click", handleControlsButtonClick);
    audioButton.addEventListener("click", handleAudioButtonClick);
    
    video.addEventListener('play',setControlImage);
    video.addEventListener('pause',setControlImage);
    video.addEventListener('ended',onVideoEnd);
    video.addEventListener('volumechange',setAudioImage);
    
    setAudioImage();
    setControlImage();
    
    if (adConfig.autoPlayVideos == true) {
        videoTrackingModule.playVideo(false);
    }
}

function setAudioImage(){
    if(video.muted){
        audioButton.style.backgroundImage = "url(../_commonAssets/audioOff.png)";
    }else{
        audioButton.style.backgroundImage = "url(../_commonAssets/audioOn.png)";
    }
}
function setControlImage(){
    if(video.paused){
        controlButton.style.backgroundImage = "url(../_commonAssets/play.png)";
    }else{
        controlButton.style.backgroundImage = "url(../_commonAssets/pause.png)";
    }
}

function onVideoEnd(){
    controlButton.style.backgroundImage = "url(../_commonAssets/replay.png)";
    video.load();
}

function handleAudioButtonClick() {
    video.muted = !video.muted;
}

function handleControlsButtonClick() {
    if(video.paused){
        video.play();
    }else{
        video.pause();
    }
    setControlImage();
}

function handleClickthroughButtonClick() {
    EB.clickthrough();
}



/*******************
UTILITIES
*******************/
function collapse() {
    handleCloseButtonClick();
}

function disablePageScrolling() {
    if (EB.API.getCustomVar("mdLockScrollingWhenExpanded")) {
        document.addEventListener("touchmove", preventDefaultEventHandler);
    }
}

function enablePageScrolling() {
    if (EB.API.getCustomVar("mdLockScrollingWhenExpanded")) {
        document.removeEventListener("touchmove", preventDefaultEventHandler);
    }
}

function preventDefaultEventHandler(event) {
    event.preventDefault();
}

/*********************************
HTML5 Event System - Do Not Modify
*********************************/
var listenerQueue;
var creativeIFrameId;

function addCustomScriptEventListener(eventName, callback, interAd) {
    listenerQueue = listenerQueue || {};
    var data = {
        uid: uid,
        listenerId: Math.ceil(Math.random() * 1000000000),
        eventName: eventName,
        interAd: !!(interAd),
        creativeIFrameId: creativeIFrameId
    };
    EB._sendMessage("addCustomScriptEventListener", data);
    data.callback = callback;
    listenerQueue[data.listenerId] = data;
    return data.listenerId;
}

function dispatchCustomScriptEvent(eventName, params) {
    params = params || {};
    params.uid = uid;
    params.eventName = eventName;
    params.creativeIFrameId = creativeIFrameId;
    EB._sendMessage("dispatchCustomScriptEvent", params);
}

function removeCustomScriptEventListener(listenerId) {
    var params = {
        uid: uid,
        listenerId: listenerId,
        creativeIFrameId: creativeIFrameId
    };

    EB._sendMessage("removeCustomScriptEventListener", params);
    if (listenerQueue[listenerId])
        delete listenerQueue[listenerId];
}

function eventManager(event) {
    var msg = JSON.parse(event.data);
    if (msg.type && msg.data && (!uid || (msg.data.uid && msg.data.uid == uid))) {
        switch (msg.type) {
            case "sendCreativeId":
                creativeIFrameId = msg.data.creativeIFrameId;
                if (creativeContainerReady)
                    creativeContainerReady();
                break;
            case "eventCallback": // Handle Callback
                var list = msg.data.listenerIds;
                var length = list.length;
                for (var i = 0; i < length; i++) {
                    try {
                        var t = listenerQueue[list[i]];
                        if (!t) continue;
                        t.callback(msg.data);
                    } catch (e) {}
                }
                break;
        }
    }
}

window.addEventListener("message", function() {
    try {
        eventManager.apply(this, arguments);
    } catch (e) {}
}, false);
/*************************************
End HTML5 Event System - Do Not Modify
*************************************/