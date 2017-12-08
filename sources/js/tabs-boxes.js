function TabsBoxes() {
}

TabsBoxes.loadTabsBoxes = function (tabsBoxesGetCallback) {
    chrome.storage.local.get(["tabsBoxes"], function (item) {
        tabsBoxesGetCallback(item.tabsBoxes);
    });
};

TabsBoxes.saveTabsBoxes = function (tabsBoxes) {
    chrome.storage.local.set({tabsBoxes: tabsBoxes}, function () {
        console.log("Boxes saved:");
        console.log(tabsBoxes);
    });
};

TabsBoxes.getBoxById = function (tabsBoxes, id) {
    var boxes = tabsBoxes.filter(function (box) {
        return box.id === id;
    });
    if (boxes.length !== 0) {
        return boxes[0];
    }
    return null;
};

TabsBoxes.closeBox = function (tabsBoxes, boxId) {
    var box = TabsBoxes.getBoxById(tabsBoxes, boxId);
    if (box !== null) {
        tabsBoxes.splice(tabsBoxes.indexOf(box), 1);
        TabsBoxes.saveTabsBoxes(tabsBoxes);
    }
};