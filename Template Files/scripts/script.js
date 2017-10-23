/*******************
VARIABLES
*******************/
var creativeId = "HTML5FullScreenExpandable";
var creativeVersion = "1.0.0";
var creativeLastModified = "2016-06-08";
var templateVersion = "2.0.10";
var adId;
var rnd;
var uid;
var adContainer;
var expandButton;

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
    setCreativeVersion(); // format versioning code, please do not alter or remove this function
}

function initializeGlobalVariables() {
    adId = EB._adConfig.adId;
    rnd = EB._adConfig.rnd;
    uid = EB._adConfig.uid;
    adContainer = document.getElementById("adContainer");
    expandButton = document.getElementById("expandBtn");

    adContainer.style.width = adConfig.contracted_width;
    adContainer.style.height = adConfig.contracted_height;

    expandButton.addEventListener("click", expand);
    addCustomScriptEventListener("showBanner", showCreativeContents, true);
}

function creativeContainerReady() {
    addCustomScriptEventListener("showBanner", showCreativeContents, true);
}

function expand() {
    var pName;
    if (isTouchDevice() == true) {
        pName = 'mobile';
    }else{
        pName = 'desktop';
    }

    EB.expand({
        panelName: pName
    });

    if (EB.API.Adaptor.getCustomVar("mdHideBannerWhenExpand")) {
        hideCreativeContents();
    }
}

function hideCreativeContents() {
    EB.API.Adaptor.setStyle(document.body, {
        display: "none"
    });
}

function showCreativeContents() {
    EB.API.Adaptor.setStyle(document.body, {
        display: "block"
    });
}

/*******************
VERSIONING
*******************/
/* format versioning code starts, please do not alter or remove these functions */
function setCreativeVersion() {
    EB._sendMessage("setCreativeVersion", {
        creativeVersion: creativeVersion,
        creativeLastModified: creativeLastModified
    });
}
/* format versioning code ends, please do not alter or remove these functions */

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