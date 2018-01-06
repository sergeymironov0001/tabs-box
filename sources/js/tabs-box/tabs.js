class Tabs {

    static selectTab(tabId) {
        chrome.tabs.update(tabId, {selected: true});
    }

    static closeTab(tabId) {
        chrome.tabs.remove(tabId, function () {
        })
    }

    static closeBoxTab(boxId) {
        Tabs.getBoxTab(boxId, function (tab) {
            if (tab) {
                Tabs.closeTab(tab.id);
            }
        });
    }

    static changeTabTitle(title) {
        $('head title', window.parent.document).text(title);
    }

    static getCurrentTab(callback) {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            var tab = tabs[0];
            callback(tab);
        });
    }

    static getCurrentTabPicture(callback) {
        chrome.tabs.captureVisibleTab(chrome.windows.WINDOW_ID_CURRENT, function (dataUrl) {
            callback(dataUrl);
        });
    }

    static getTabById(tabId, callback) {
        chrome.tabs.get(tabId, function (tabInfo) {
            console.log(tabInfo);
            callback(tabInfo);
        });
    }

    static getBoxTab(boxId, callback) {
        var url = chrome.extension.getURL('html/tabs-box.html?boxId=' + boxId);
        Tabs.getTabByUrl(url, callback);
    }

    static getTabByUrl(url, callback) {
        chrome.tabs.query({url: url},
            function (tabs) {
                if (tabs && tabs.length > 0) {
                    callback(tabs[0]);
                } else {
                    callback(undefined);
                }
            });
    }

    static getTabsByUrl(url, callback) {
        chrome.tabs.query({url: url},
            function (tabs) {
                console.log("Tabs by url " + url);
                console.log(tabs);
                callback(tabs);
            });
    }

    static createBoxTab(boxId, callback) {
        Tabs.createTab(chrome.extension.getURL('html/tabs-box.html?boxId=' + boxId), callback);
    }

    static createTab(url, callback) {
        chrome.tabs.create({
                'url': url,
                'active': false,
                'selected': false
            },
            callback);
    }
}