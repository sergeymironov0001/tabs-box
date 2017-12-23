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
        console.log("Remove box with id " + boxId);
        var box = _getBoxById(boxes, boxId);
        console.log(" box " + box);
        if (box !== null) {
            boxes.splice(boxes.indexOf(box), 1);
            console.log("Box removed");
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
        var box = new Box();
        box.init();
        if (_addNewBox(this.boxes, box)) {
            this.saveBoxes();
            Notifications.sendNewBoxAdded(box);
        }
        return box;
    };

    this.addBox = function (boxInfo) {
        var box = _createBox(boxInfo);
        if (_addNewBox(this.boxes, box)) {
            this.saveBoxes();
            Notifications.sendNewBoxAdded(box);
        }
        return box;
    };

    this.saveBoxes = function () {
        var self = this;
        chrome.storage.local.set({tabsBoxes: this.boxes}, function () {
            console.log("Boxes saved:");
            console.log(self.boxes);
        });
    };

    this.getBoxById = function (id) {
        return _getBoxById(this.boxes, id);
    };

    this.changeBoxName = function (boxId, boxName) {
        var box = this.getBoxById(boxId);
        if (box && box !== null) {
            box.changeName(boxName);
            this.saveBoxes();
        }
    };

    this.putTabToBox = function (boxId, tab) {
        var box = this.getBoxById(boxId);
        if (box && box !== null) {
            box.putTabToBox(tab);
            this.saveBoxes();
        }
    };

    this.removeTabFromBox = function (boxId, tab) {
        var box = this.getBoxById(boxId);
        if (box && box !== null) {
            box.removeTabFromBox(tab);
            this.saveBoxes();
        }
    };

    this.removeBox = function (box) {
        if (_removeBox(this.boxes, box.id)) {
            this.saveBoxes();
            Notifications.sendBoxRemoved(box);
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
    chrome.storage.local.get(["tabsBoxes"], function (item) {
        var boxes = new Boxes(item.tabsBoxes);
        boxes.init();
        callback(boxes);
    });
};
