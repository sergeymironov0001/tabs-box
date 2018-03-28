class LocalStorageUtils {

    static saveBoxes(boxes, callback) {
        chrome.storage.local.set({boxes: boxes}, callback);
    }

    static loadBoxes(callback) {
        chrome.storage.local.get(["boxes"], item =>
            callback(item ? item.boxes : undefined));
    }

    static saveTheme(theme, callback) {
        chrome.storage.local.set({theme: theme}, callback);
    }

    static loadTheme(callback) {
        chrome.storage.local.get(["theme"], item =>
            callback(item ? item.theme : undefined));
    }
}