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

Tabs.createTabInfo = function (tab, thumbImgUrl) {
    return {
        url: tab.url,
        title: tab.title,
        faviconUrl: Tabs.getTabFaviconUrl(tab),
        thumbImgUrl: thumbImgUrl,
        tab: tab
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

Tabs.createNewTab = function (callback) {
    chrome.tabs.create({
            'url': chrome.extension.getURL('html/tabs-box.html'),
            'active': false,
            'selected': false
        },
        callback);
};