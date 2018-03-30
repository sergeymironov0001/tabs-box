class TabUtils {

    static selectTab(tabId) {
        chrome.tabs.update(tabId, {selected: true});
    }

    static selectBoxTab(boxId) {
        TabUtils.getBoxTab(boxId, tab => {
            if (tab) {
                TabUtils.selectTab(tab.id);
            } else {
                TabUtils.createBoxTab(boxId, newTab => {
                    // TabUtils.selectTab(newTab.id);
                });
            }
        });
    }

    static selectOptionsTab() {
        TabUtils.getOptionsTab(tab => {
            if (tab) {
                TabUtils.selectTab(tab.id);
            } else {
                TabUtils.createOptionsTab(newTab =>
                    TabUtils.selectTab(newTab.id));
            }
        });
    }

    static selectTabByUrl(url) {
        TabUtils.getTabByUrl(url, tab => {
            if (tab) {
                TabUtils.selectTab(tab.id);
            } else {
                TabUtils.createTab(url);
            }
        });
    }

    static closeTab(tabId) {
        chrome.tabs.remove(tabId);
    }

    static closeBoxTab(boxId) {
        TabUtils.getBoxTab(boxId, tab => {
            if (tab) {
                TabUtils.closeTab(tab.id);
            }
        });
    }

    static changeTabTitle(title) {
        $('head title', window.parent.document).text(title);
    }

    static getCurrentTab(callback) {
        chrome.tabs.query({active: true, currentWindow: true}, tabs =>
            callback(tabs[0]));
    }

    static getCurrentWindowTabs(callback) {
        chrome.tabs.query({currentWindow: true}, tabs => callback(tabs));
    }

    static getCurrentTabPicture(callback) {
        chrome.tabs.captureVisibleTab(chrome.windows.WINDOW_ID_CURRENT,
            dataUrl => callback(dataUrl));
    }

    static getTabById(tabId, callback) {
        chrome.tabs.get(tabId, tabInfo => callback(tabInfo));
    }

    static getBoxTab(boxId, callback) {
        let url = chrome.extension.getURL('html/tabs-box.html?boxId=' + boxId);
        TabUtils.getTabByUrl(url, callback);
    }

    static getOptionsTab(callback) {
        let url = chrome.extension.getURL('html/options.html');
        TabUtils.getTabByUrl(url, callback);
    }

    static getTabByUrl(url, callback) {
        chrome.tabs.query({url: url},
            tabs => {
                if (tabs && tabs.length > 0) {
                    callback(tabs[0]);
                } else {
                    callback(undefined);
                }
            });
    }

    static getTabsByUrl(url, callback) {
        chrome.tabs.query({url: url},
            tabs => callback(tabs));
    }

    static createBoxTab(boxId, callback) {
        TabUtils.createTab(
            chrome.extension.getURL('html/tabs-box.html?boxId=' + boxId),
            callback);
    }

    static createOptionsTab(callback) {
        TabUtils.createTab(
            chrome.extension.getURL('html/options.html'), callback);
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