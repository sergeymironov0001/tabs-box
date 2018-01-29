class LocalStorage {

    static saveBoxes(boxes, callback) {
        chrome.storage.local.set({tabsBoxes: boxes}, callback);
    }

    static loadBoxes(callback) {
        chrome.storage.local.get(["tabsBoxes"], function (item) {
            callback(item.tabsBoxes);
        });
    }

    static saveTheme(theme, callback) {
        chrome.storage.local.set({theme: theme}, callback);
    }

    static loadTheme(callback) {
        chrome.storage.local.get(["theme"], function (item) {
            if (item) {
                callback(item.theme);
            } else {
                callback(undefined);
            }
        });
    }
}