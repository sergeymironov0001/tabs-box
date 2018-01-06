function Tabs() {
}

Tabs.getTabFaviconUrl = function (tab) {
    return tab.favIconUrl;
};

Tabs.selectTab = function (tabId) {
    chrome.tabs.update(tabId, {selected: true});
};

Tabs.closeTab = function (tabId) {
    chrome.tabs.remove(tabId, function () {
    })
};

Tabs.closeBoxTab = function (boxId) {
    Tabs.getBoxTab(boxId, function (tab) {
        if (tab) {
            Tabs.closeTab(tab.id);
        }
    });
};

Tabs.createTabInfo = function (tab, thumbImgUrl) {
    return {
        url: tab.url,
        title: tab.title,
        faviconUrl: Tabs.getTabFaviconUrl(tab),
        thumbImgUrl: thumbImgUrl
    };
};

Tabs.changeTabTitle = function (title) {
    $('head title', window.parent.document).text(title);
};

Tabs.getCurrentTab = function (callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        var tab = tabs[0];
        callback(tab);
    });
};

Tabs.getCurrentTabPicture = function (callback) {
    chrome.tabs.captureVisibleTab(chrome.windows.WINDOW_ID_CURRENT, function (dataUrl) {
        callback(dataUrl);
    });
};

Tabs.getTabById = function (tabId, callback) {
    chrome.tabs.get(tabId, function (tabInfo) {
        console.log(tabInfo);
        callback(tabInfo);
    });
};

Tabs.getBoxTab = function (boxId, callback) {
    var url = chrome.extension.getURL('html/tabs-box.html?boxId=' + boxId);
    Tabs.getTabByUrl(url, callback);
};

Tabs.getTabByUrl = function (url, callback) {
    chrome.tabs.query({url: url},
        function (tabs) {
            if (tabs && tabs.length > 0) {
                callback(tabs[0]);
            } else {
                callback(undefined);
            }
        });
};

Tabs.getTabsByUrl = function (url, callback) {
    chrome.tabs.query({url: url},
        function (tabs) {
            console.log("Tabs by url " + url);
            console.log(tabs);
            callback(tabs);
        });
};

Tabs.createBoxTab = function (boxId, callback) {
    Tabs.createTab(chrome.extension.getURL('html/tabs-box.html?boxId=' + boxId), callback);
};

Tabs.createTab = function (url, callback) {
    chrome.tabs.create({
            'url': url,
            'active': false,
            'selected': false
        },
        callback);
};