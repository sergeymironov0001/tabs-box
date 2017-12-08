chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if ("tabs-box:change-box-name" === request.type) {
        TabsBoxes.loadTabsBoxes(function (tabsBoxes) {
            var box = TabsBoxes.getBoxById(tabsBoxes, request.id);
            box.name = request.name;
            TabsBoxes.saveTabsBoxes(tabsBoxes);
        });
    }
});

chrome.tabs.onRemoved.addListener(function (tabId, removed) {
    TabsBoxes.loadTabsBoxes(function (tabsBoxes) {
        TabsBoxes.closeBox(tabsBoxes, tabId);
    });
});

chrome.windows.onRemoved.addListener(function (windowid) {
    // TODO process the event
    // alert("window closed")
});
