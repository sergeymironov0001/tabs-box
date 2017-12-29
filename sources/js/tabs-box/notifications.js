function Notifications() {
}

function sendMessage(message, callback) {
    chrome.runtime.sendMessage(message, function (response) {
        if (callback) {
            callback(response);
        }
    });
}

Notifications.sendNewBoxAdded = function (box, callback) {
    sendMessage({
            type: "tabs-box:new-box-added",
            box: box
        },
        callback);
};

Notifications.sendBoxNameChanged = function (box) {
    sendMessage({
        type: "tabs-box:change-box-name",
        id: box.id,
        name: box.name
    });
};

Notifications.sendPutTabToBox = function (boxId, tab, callback) {
    sendMessage({
            type: "tabs-box:put-tab-to-box",
            boxId: boxId,
            tab: tab
        },
        callback);
};

Notifications.sendTabForBoxOpened = function (callback) {
    sendMessage({
        type: "tabs-box:tab-for-box-opened"
    }, callback);
};

Notifications.sendChangeTabPosition = function (boxId, tabId, newPosition, callback) {
    sendMessage({
        type: "tabs-box:change-tab-position",
        boxId: boxId,
        tabId: tabId,
        newPosition: newPosition
    }, callback);
};

Notifications.sendTabFromBoxRemoved = function (boxId, tab, callback) {
    sendMessage({
            type: "tabs-box:remove-tab-from-box",
            boxId: boxId,
            tab: tab
        },
        callback);
};

Notifications.sendBoxRemoved = function (box, callback) {
    sendMessage({
            type: "tabs-box:box-removed",
            box: box
        },
        callback);
};

function addListener(requestType, callback) {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (requestType === request.type) {
            callback(request);
        }
    });
}

Notifications.addNewBoxAddedListener = function (callback) {
    addListener("tabs-box:new-box-added", function (request) {
        callback(request.box);
    });
};


Notifications.addChangeBoxNameListener = function (boxId, callback) {
    addListener("tabs-box:change-box-name", function (request) {
        if (request.id === boxId) {
            callback(request.name);
        }
    });
};

Notifications.addChangeBoxNameListener1 = function (callback) {
    addListener("tabs-box:change-box-name", function (request) {
        callback(request.id, request.name);
    });
};

Notifications.addRemoveTabFromBoxListener = function (callback) {
    addListener("tabs-box:remove-tab-from-box", function (request) {
        callback(request.boxId, request.tab);
    });
};


Notifications.addRemoveTabFromBoxListener = function (boxId, callback) {
    addListener("tabs-box:remove-tab-from-box", function (request) {
            if (boxId === request.boxId) {
                callback(request.tab);
            }
        }
    );
};

Notifications.addPutTabToBoxListener = function (boxId, callback) {
    addListener("tabs-box:put-tab-to-box", function (request) {
        if (boxId === request.boxId) {
            callback(request.tab);
        }
    });
};

Notifications.addBoxRemovedListener = function (callback) {
    addListener("tabs-box:box-removed", function (request) {
        callback(request.box)
    });
};

Notifications.addTabRemoveListener = function (callback) {
    chrome.tabs.onRemoved.addListener(function (tabId, removed) {
        callback(tabId);
    });
};

Notifications.addChangeTabPositionListener = function (boxId, callback) {
    addListener("tabs-box:change-tab-position", function (request) {
        if (boxId === request.boxId) {
            callback(request.tabId, request.newPosition);
        }
    });
};

Notifications.addChangeTabsPositionListener = function (callback) {
    addListener("tabs-box:change-tab-position", function (request) {
        callback(request.boxId, request.tabId, request.newPosition);
    });
};
