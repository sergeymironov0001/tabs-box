class NotificationUtils {

    static sendNewBoxAdded(box, callback) {
        NotificationUtils._sendMessage({
                type: "tabs-box:new-box-added",
                box: box
            },
            callback);
    }

    static sendBoxNameChanged(box) {
        NotificationUtils._sendMessage({
            type: "tabs-box:change-box-name",
            id: box.id,
            name: box.name
        });
    }

    static sendPutTabToBox(boxId, tab, callback) {
        NotificationUtils._sendMessage({
                type: "tabs-box:put-tab-to-box",
                boxId: boxId,
                tab: tab
            },
            callback);
    }

    static sendChangeTabPosition(boxId, tabId, newPosition, callback) {
        NotificationUtils._sendMessage({
            type: "tabs-box:change-tab-position",
            boxId: boxId,
            tabId: tabId,
            newPosition: newPosition
        }, callback);
    }

    static sendChangeTabTitleAndUrl(tabId, title, url, callback) {
        NotificationUtils._sendMessage({
            type: "tabs-box:change-tab-title-and-url",
            tabId: tabId,
            title: title,
            url: url
        }, callback);
    }

    static sendTabFromBoxRemoved(boxId, tabId, callback) {
        NotificationUtils._sendMessage({
                type: "tabs-box:remove-tab-from-box",
                boxId: boxId,
                tabId: tabId
            },
            callback);
    }

    static sendBoxRemoved(boxId, callback) {
        NotificationUtils._sendMessage({
                type: "tabs-box:box-removed",
                boxId: boxId
            },
            callback);
    }

    static sendThemeChanged(theme, callback) {
        NotificationUtils._sendMessage({
                type: "tabs-box:theme-changed",
                theme: theme
            },
            callback);
    }

    static addNewBoxAddedListener(callback) {
        NotificationUtils._addListener("tabs-box:new-box-added", function (request) {
            callback(request.box);
        });
    }


    static addChangeBoxNameListener(boxId, callback) {
        NotificationUtils._addListener("tabs-box:change-box-name", function (request) {
            if (request.id === boxId) {
                callback(request.name);
            }
        });
    }

    static addRemoveTabFromBoxListener(boxId, callback) {
        NotificationUtils._addListener("tabs-box:remove-tab-from-box", function (request) {
                if (boxId === request.boxId) {
                    callback(request.tabId);
                }
            }
        );
    }

    static addPutTabToBoxListener(boxId, callback) {
        NotificationUtils._addListener("tabs-box:put-tab-to-box", function (request) {
            if (boxId === request.boxId) {
                callback(request.tab);
            }
        });
    }

    static addBoxRemovedListener(callback) {
        NotificationUtils._addListener("tabs-box:box-removed", function (request) {
            callback(request.boxId)
        });
    }

    static addTabRemoveListener(callback) {
        chrome.tabs.onRemoved.addListener(function (tabId, removed) {
            callback(tabId);
        });
    }

    static addChangeTabPositionListener(boxId, callback) {
        NotificationUtils._addListener("tabs-box:change-tab-position", function (request) {
            if (boxId === request.boxId) {
                callback(request.tabId, request.newPosition);
            }
        });
    }

    static addChangeTabTitleAndUrlListener(tabId, callback) {
        NotificationUtils._addListener("tabs-box:change-tab-title-and-url", function (request) {
            if (tabId === request.tabId) {
                callback(request.title, request.url);
            }
        });
    }

    static addChangeTabTitleAndUrlListener_(callback) {
        NotificationUtils._addListener("tabs-box:change-tab-title-and-url", function (request) {
            console.log("changed tab_");
            callback(request.boxId, request.tabId, request.title, request.url);
        });
    }

    static addThemeChangedListener(callback) {
        NotificationUtils._addListener("tabs-box:theme-changed", function (request) {
            callback(request.theme);
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