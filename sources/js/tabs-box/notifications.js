function Notifications() {
}

Notifications.sendBoxNameChanged = function (box) {
    chrome.runtime.sendMessage({
            type: "tabs-box:change-box-name",
            id: box.id,
            name: box.name
        },
        function (response) {
        }
    );
};

Notifications.addChangeBoxNameListener = function (callback) {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if ("tabs-box:change-box-name" === request.type) {
            callback(request.id, request.name);
        }
    });
};

Notifications.sendPutTabInBox = function (boxId, tab, callback) {
    chrome.runtime.sendMessage({
            type: "tabs-box:put-in-box",
            boxId: boxId,
            tab: tab
        },
        function (response) {
            callback(response);
        }
    );
};

Notifications.addPutTabInBoxListener = function (boxId, callback) {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            if ("tabs-box:put-in-box" === request.type && boxId === request.boxId) {
                callback(request.tab);
                sendResponse();
            }
        }
    );
};


Notifications.notifyBoxWasCreated = function (callback) {
    chrome.runtime.sendMessage({type: "tabs-box:box-created"}, function (boxInfo) {
        if (boxInfo !== undefined && boxInfo !== null) {
            callback(boxInfo.id, boxInfo.name, boxInfo.tab);
        }
    });
};

Notifications.createTabBoxListener = function (createdBoxId, callback) {
    var listener = function (request, sender, sendResponse) {
        if (createdBoxId === sender.tab.id &&
            request.type === "tabs-box:box-created") {
            callback(sendResponse);

            chrome.runtime.onMessage.removeListener(listener);
        }
    };

    chrome.runtime.onMessage.addListener(listener);
};


Notifications.addTabRemoveListener = function (callback) {
    chrome.tabs.onRemoved.addListener(function (tabId, removed) {
        callback(tabId);
    });
};