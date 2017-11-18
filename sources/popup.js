var tabsBoxes = [];

chrome.browserAction.onClicked.addListener(function (activeTab) {
    // var newURL = "http://www.youtube.com/";
    // chrome.tabsBoxes.create({ url: newURL });
    // chrome.tabsBoxes.getSelected(null,function(tab) {
    //     var tablink = tab.url;
    // });
    // alert(activeTab.url);

    if (tabsBoxes.length === 0) {
        chrome.tabs.create({
                'url': chrome.extension.getURL('tabs-box.html'),
                'active': false,
                'selected': false
            },
            function (tab) {
                var createTabListener = function (request, sender, sendResponse) {
                    if (request.hasOwnProperty("type") && request.type === "tabs-box:box-created") {
                        sendResponse(getTabInfo(activeTab));
                    }
                    chrome.runtime.onMessage.removeListener(createTabListener);
                };
                chrome.runtime.onMessage.addListener(createTabListener);
                tabsBoxes.push(tabBox(tab.id));
            });
    } else {
        putTabInBox(getTabInfo(activeTab));
    }
    // closeTab(activeTab.id);
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
        "title": tab.title
    };
}

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