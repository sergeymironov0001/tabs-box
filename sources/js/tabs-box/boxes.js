// var TabsBoxes = (function () {
//     var instance;
//
//     function createInstance() {
//         return {};
//     }
//
//     return {
//         getInstance: function () {
//             if (!instance) {
//                 instance = createInstance();
//             }
//             return instance;
//         }
//     };
// })();

function Boxes() {
}

Boxes.createBox = function (boxId) {
    var boxName = "Tabs box";
    return {
        id: boxId,
        name: boxName
    };
};

Boxes.getBoxes = function (callBack) {
    Boxes.loadBoxes(callBack);
};

Boxes.loadBoxes = function (getBoxesCallback) {
    chrome.storage.local.get(["tabsBoxes"], function (item) {
        getBoxesCallback(item.tabsBoxes);
    });
};

Boxes.saveBoxes = function (boxes) {
    chrome.storage.local.set({tabsBoxes: boxes}, function () {
        console.log("Boxes saved:");
        console.log(boxes);
    });
};

Boxes.getBoxById = function (boxes, id) {
    var boxes = boxes.filter(function (box) {
        return box.id === id;
    });
    if (boxes.length !== 0) {
        return boxes[0];
    }
    return null;
};

Boxes.changeBoxName = function (boxes, boxId, boxName) {
    var box = Boxes.getBoxById(boxes, boxId);
    box.name = boxName;
};

Boxes.closeBox = function (boxes, boxId) {
    var box = Boxes.getBoxById(boxes, boxId);
    if (box !== null) {
        boxes.splice(boxes.indexOf(box), 1);
        Boxes.saveBoxes(boxes);
    }
};

Boxes.deleteBox = function (boxId) {
    Boxes.loadBoxes(function (boxes) {
        boxes = boxes.filter(function (box) {
            return box.id !== boxId;
        });
        Boxes.saveBoxes(boxes);
    });
};