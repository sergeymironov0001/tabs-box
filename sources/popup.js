var tabsBoxes = [];

chrome.browserAction.onClicked.addListener(function (activeTab) {
    // var newURL = "http://www.youtube.com/";
    // chrome.tabsBoxes.create({ url: newURL });
    // chrome.tabsBoxes.getSelected(null,function(tab) {
    //     var tablink = tab.url;
    // });
    // alert(activeTab.url);

    if (tabsBoxes.length === 0) {
        chrome.tabs.captureVisibleTab(chrome.windows.WINDOW_ID_CURRENT, function (dataUrl) {
            chrome.tabs.create({
                    'url': chrome.extension.getURL('tabs-box.html'),
                    'active': false,
                    'selected': false
                },
                function (tab) {
                    var createTabListener = function (request, sender, sendResponse) {
                        if (request.hasOwnProperty("type") && request.type === "tabs-box:box-created") {
                            var tabInfo = getTabInfo(activeTab);
                            tabInfo.thumbImgUrl = dataUrl;
                            sendResponse(tabInfo);
                        }
                        chrome.runtime.onMessage.removeListener(createTabListener);
                        // closeTab(activeTab.id);
                    };
                    chrome.runtime.onMessage.addListener(createTabListener);
                    tabsBoxes.push(tabBox(tab.id));
                });
        });
    } else {
        chrome.tabs.captureVisibleTab(chrome.windows.WINDOW_ID_CURRENT, function (dataUrl) {
            var tabInfo = getTabInfo(activeTab);
            tabInfo.thumbImgUrl = dataUrl;
            putTabInBox(tabInfo);
            // closeTab(activeTab.id);
        });
    }
});

chrome.tabs.onRemoved.addListener(function callback(tabId) {
    // remove closed tab from the tabsBoxes list
    tabsBoxes = tabsBoxes.filter(function (tabsBox) {
        return tabsBox.id !== tabId;
    });
});

function tabBox(id) {
    return {
        "id": id
    };
}

function getTabInfo(tab) {
    return {
        "url": tab.url,
        "title": tab.title,
        "faviconUrl": getFaviconUrl(tab),
        "tab": tab
    };
}

function getFaviconUrl(tab) {
    // var origin = new URL(url).origin;
    // return 'https://s2.googleusercontent.com/s2/favicons?domain_url=' + origin + '&amp;alt=s&amp;sz=32';
    return tab.favIconUrl;
}

// function getThumbUrlFunction(tab) {
//     return function () {
//         tab.captureVisibleTab(function (dataUrl) {
//         })
//     }
//     // var origin = new URL(url).origin;
//     // return 'chrome-search://thumb2/' + origin + '?fb=https://www.google.com/webpagethumbnail?c=63&d=' + url + '&r=4&s=154:96&a=JWEfHGnW1RHbkebZG_oGo6Z_LV8'
// }

function putTabInBox(tabInfo) {
    chrome.runtime.sendMessage({
        "type": "tabs-box:put-in-box",
        "tabInfo": tabInfo
    }, function (response) {
        // alert(response);
    });
}

function closeTab(tabId) {
    chrome.tabs.remove(tabId, function () {
    });
}