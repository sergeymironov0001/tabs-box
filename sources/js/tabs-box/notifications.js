class Notifications {

    static sendNewBoxAdded(box, callback) {
        Notifications._sendMessage({
                type: "tabs-box:new-box-added",
                box: box
            },
            callback);
    }

    static sendBoxNameChanged(box) {
        Notifications._sendMessage({
            type: "tabs-box:change-box-name",
            id: box.id,
            name: box.name
        });
    }

    static sendPutTabToBox(boxId, tab, callback) {
        Notifications._sendMessage({
                type: "tabs-box:put-tab-to-box",
                boxId: boxId,
                tab: tab
            },
            callback);
    }

    static sendChangeTabPosition(boxId, tabId, newPosition, callback) {
        Notifications._sendMessage({
            type: "tabs-box:change-tab-position",
            boxId: boxId,
            tabId: tabId,
            newPosition: newPosition
        }, callback);
    }

    static sendChangeTabTitleAndUrl(boxId, tabId, title, url, callback) {
        console.log("Notify");
        Notifications._sendMessage({
            type: "tabs-box:change-tab-title-and-url",
            boxId: boxId,
            tabId: tabId,
            title: title,
            url: url
        }, callback);
    }

    static sendTabFromBoxRemoved(boxId, tabId, callback) {
        Notifications._sendMessage({
                type: "tabs-box:remove-tab-from-box",
                boxId: boxId,
                tabId: tabId
            },
            callback);
    }

    static sendBoxRemoved(box, callback) {
        Notifications._sendMessage({
                type: "tabs-box:box-removed",
                box: box
            },
            callback);
    }

    static addNewBoxAddedListener(callback) {
        Notifications._addListener("tabs-box:new-box-added", function (request) {
            callback(request.box);
        });
    }


    static addChangeBoxNameListener(boxId, callback) {
        Notifications._addListener("tabs-box:change-box-name", function (request) {
            if (request.id === boxId) {
                callback(request.name);
            }
        });
    }

    static addRemoveTabFromBoxListener(boxId, callback) {
        Notifications._addListener("tabs-box:remove-tab-from-box", function (request) {
                if (boxId === request.boxId) {
                    callback(request.tabId);
                }
            }
        );
    }

    static addPutTabToBoxListener(boxId, callback) {
        Notifications._addListener("tabs-box:put-tab-to-box", function (request) {
            if (boxId === request.boxId) {
                callback(request.tab);
            }
        });
    }

    static addBoxRemovedListener(callback) {
        Notifications._addListener("tabs-box:box-removed", function (request) {
            callback(request.box)
        });
    }

    static addTabRemoveListener(callback) {
        chrome.tabs.onRemoved.addListener(function (tabId, removed) {
            callback(tabId);
        });
    }

    static addChangeTabPositionListener(boxId, callback) {
        Notifications._addListener("tabs-box:change-tab-position", function (request) {
            if (boxId === request.boxId) {
                callback(request.tabId, request.newPosition);
            }
        });
    }

    static addChangeTabTitleAndUrlListener(boxId, callback) {
        Notifications._addListener("tabs-box:change-tab-title-and-url", function (request) {
            console.log("changed tab " + boxId + " : " + request.boxId);
            if (boxId === request.boxId) {
                callback(request.tabId, request.title, request.url);
            }
        });
    }

    static addChangeTabTitleAndUrlListener_(callback) {
        Notifications._addListener("tabs-box:change-tab-title-and-url", function (request) {
            console.log("changed tab_");
            callback(request.boxId, request.tabId, request.title, request.url);
        });
    }

    static _sendMessage(message, callback) {
        chrome.runtime.sendMessage(message, function (response) {
            if (callback) {
                callback(response);
            }
        });
    }

    static _addListener(requestType, callback) {
        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            if (requestType === request.type) {
                callback(request);
            }
        });
    }
}