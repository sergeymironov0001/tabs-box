Notifications.addChangeBoxNameListener(function (boxId, boxName) {
    Boxes.loadBoxes(function (boxes) {
        Boxes.changeBoxName(boxes, boxId, boxName);
        Boxes.saveBoxes(boxes);
    });
});

Notifications.addTabRemoveListener(function (tabId) {
    Boxes.loadBoxes(function (tabsBoxes) {
        Boxes.closeBox(tabsBoxes, tabId);
    });
});

// chrome.windows.onRemoved.addListener(function (windowid) {
//     // TODO process the event
//     // alert("window closed")
// });
