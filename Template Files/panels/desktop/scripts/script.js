/*******************
VARIABLES
*******************/
var closeButton;
var userActionButton;
var clickthroughButton;
var sdkData = null;
var adId;
var rnd;
var uid;

/*******************
INITIALIZATION
*******************/
function checkIfAdKitReady(event) {
    adkit.onReady(initializeCreative);
}

function initializeCreative() {
    initializeGlobalVariables();
    initializeCloseButton();
    addEventListeners();
}

function initializeGlobalVariables() {
    adId = EB._adConfig.adId;
    rnd = EB._adConfig.rnd;
    uid = EB._adConfig.uid;

    closeButton = document.getElementById("close-button");
    userActionButton = document.getElementById("user-action-button");
    clickthroughButton = document.getElementById("click-through-button");

    sdkData = EB.getSDKData();
}

function initializeCloseButton() {
    if (sdkData !== undefined && sdkData !== null && sdkData.SDKType === "MRAID" && EB.API.getCustomVar("mdEnableSDKDefaultCloseButton")) {
        EB.API.setStyle(closeButton, {
            display: "none"
        });
    } else {
        EB.API.setStyle(closeButton, {
            display: "block"
        });
    }
}

function addEventListeners() {
    closeButton.addEventListener("click", handleCloseButtonClick);
    userActionButton.addEventListener("click", handleUserActionButtonClick);
    clickthroughButton.addEventListener("click", handleClickthroughButtonClick);
    if (EB.API.os.mobile) {
        document.addEventListener((EB.API.os.ios && EB.API.os.ver > 7 ? "touchstart" : "touchmove"), disablePageScrolling);
    }
}

function creativeContainerReady() {}

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

function handleUserActionButtonClick() {
    EB.userActionCounter("CustomInteraction");
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

window.addEventListener("DOMContentLoaded", checkIfAdKitReady);
