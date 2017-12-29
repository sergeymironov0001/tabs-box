function Boxes(boxesInfo) {
    this.boxes = [];

    if (boxesInfo) {
        var self = this;
        boxesInfo.forEach(function (boxInfo) {
            _addNewBox(self.boxes, _createBox(boxInfo));
        });
    }

    function _createBox(boxInfo) {
        var box = new Box(boxInfo.id, boxInfo.name, boxInfo.tabs);
        box.init();
        return box;
    }

    function _addNewBox(boxes, box) {
        boxes.push(box);
        return true;
    }

    function _removeBox(boxes, boxId) {
        var box = _getBoxById(boxes, boxId);
        if (box !== null) {
            boxes.splice(boxes.indexOf(box), 1);
            return true;
        }
        return false;
    }

    function _getBoxById(boxes, id) {
        var foundBoxes = boxes.filter(function (box) {
            return box.id === id;
        });
        if (foundBoxes.length !== 0) {
            return foundBoxes[0];
        }
        return null;
    }

    this.getBoxes = function () {
        return this.boxes;
    };

    this.addNewBox = function () {
        console.log("Adding new box...");
        var box = new Box();
        box.init();
        if (_addNewBox(this.boxes, box)) {
            this.saveBoxes();
            Notifications.sendNewBoxAdded(box);
            console.log("New box=" + box + "was added");
            return box;
        }
        return undefined;
    };

    this.saveBoxes = function () {
        console.log("Saving boxes=" + this.boxes + " ...");
        var self = this;
        chrome.storage.local.set({tabsBoxes: this.boxes}, function () {
            console.log("Boxes=" + self.boxes + " was saved");
        });
    };

    this.getBoxById = function (id) {
        return _getBoxById(this.boxes, id);
    };

    this.changeBoxName = function (boxId, boxName) {
        console.log("Changing name of the box with id=" + boxId + " to '" + boxName + "' ...");
        var box = this.getBoxById(boxId);
        if (box && box !== null) {
            box.changeName(boxName);
            this.saveBoxes();
            console.log("Box name with id=" + boxId + " was changed to '" + boxName + "'")
        }
    };

    this.putTabToBox = function (boxId, tab) {
        console.log("Putting tab=" + tab + " to the box with id=" + boxId + " ...");
        var box = this.getBoxById(boxId);
        if (box && box !== null) {
            box.putTabToBox(tab);
            this.saveBoxes();
            console.log("Tab=" + tab + " was put to the box with id=" + boxId);
        }
    };

    this.changeTabPosition = function (boxId, tabId, newPosition) {
        var box = this.getBoxById(boxId);
        if (box && box != null) {
            box.changeTabPosition(tabId, newPosition);
            this.saveBoxes();
        }
    };

    this.removeTabFromBox = function (boxId, tab) {
        console.log("Removing tab=" + tab + " from the box with id=" + boxId + " ...");
        var box = this.getBoxById(boxId);
        if (box && box !== null) {
            box.removeTabFromBox(tab);
            this.saveBoxes();
            console.log("Tab=" + tab + " was removed form the box with id=" + boxId);
        }
    };

    this.removeBox = function (box) {
        console.log("Removing box=" + box + " ...")
        if (_removeBox(this.boxes, box.id)) {
            this.saveBoxes();
            Notifications.sendBoxRemoved(box);
            console.log("Box=" + box + " was removed ")
        }
    };

    this.init = function () {
        var self = this;
        Notifications.addNewBoxAddedListener(function (boxInfo) {
            var box = _createBox(boxInfo);
            _addNewBox(self.boxes, box);
        });

        Notifications.addBoxRemovedListener(function (box) {
            _removeBox(self.boxes, box.id);
        });
    };
}

Boxes.loadBoxes = function (callback) {
    console.log("Loading boxes from the store...");
    chrome.storage.local.get(["tabsBoxes"], function (item) {
        var boxes = new Boxes(item.tabsBoxes);
        boxes.init();
        console.log("Boxes=" + boxes + " was loaded from the store");
        callback(boxes);
    });
};
