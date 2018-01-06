class Boxes {

    constructor(boxesInfo) {
        this.boxes = [];
        if (boxesInfo) {
            var self = this;
            boxesInfo.forEach(function (boxInfo) {
                Boxes._addNewBox(self.boxes, Boxes._createBox(boxInfo));
            });
        }
    }

    getBoxes() {
        return this.boxes;
    }

    addNewBox() {
        console.log("Adding new box...");
        var box = new Box();
        box.init();
        if (Boxes._addNewBox(this.boxes, box)) {
            this.saveBoxes();
            Notifications.sendNewBoxAdded(box);
            console.log("New box=" + box + "was added");
            return box;
        }
        return undefined;
    }

    saveBoxes() {
        console.log("Saving boxes=" + this.boxes + " ...");
        var self = this;
        chrome.storage.local.set({tabsBoxes: this.boxes}, function () {
            console.log("Boxes=" + self.boxes + " was saved");
        });
    }

    getBoxById(id) {
        return Boxes._getBoxById(this.boxes, id);
    }

    changeBoxName(boxId, boxName) {
        console.log("Changing name of the box with id=" + boxId + " to '" + boxName + "' ...");
        var box = this.getBoxById(boxId);
        if (box && box !== null) {
            box.changeName(boxName);
            this.saveBoxes();
            console.log("Box name with id=" + boxId + " was changed to '" + boxName + "'")
        }
    }

    putTabToBox(boxId, tab) {
        console.log("Putting tab=" + tab + " to the box with id=" + boxId + " ...");
        var box = this.getBoxById(boxId);
        if (box && box !== null) {
            box.putTabToBox(tab);
            this.saveBoxes();
            console.log("Tab=" + tab + " was put to the box with id=" + boxId);
        }
    }

    changeTabPosition(boxId, tabId, newPosition) {
        console.log("Change tab position: boxId=" + boxId + ", tabId=" + tabId + ", newPosition=" + newPosition);
        var box = this.getBoxById(boxId);
        if (box && box != null) {
            box.changeTabPosition(tabId, newPosition);
            this.saveBoxes();
        }
    }

    removeTabFromBox(boxId, tab) {
        console.log("Removing tab=" + tab + " from the box with id=" + boxId + " ...");
        var box = this.getBoxById(boxId);
        if (box && box !== null) {
            box.removeTabFromBox(tab);
            this.saveBoxes();
            console.log("Tab=" + tab + " was removed form the box with id=" + boxId);
        }
    }

    changeBoxPosition(boxId, newPosition) {
        var box = this.getBoxById(boxId);
        if (box && box != null) {
            var oldPosition = this.boxes.indexOf(box);
            if (oldPosition >= 0) {
                var tmp = this.boxes[newPosition];
                this.boxes[newPosition] = box;
                this.boxes[oldPosition] = tmp;
                this.saveBoxes();
            }
        }
    }

    removeBox(box) {
        console.log("Removing box=" + box + " ...")
        if (Boxes._removeBox(this.boxes, box.id)) {
            this.saveBoxes();
            Notifications.sendBoxRemoved(box);
            console.log("Box=" + box + " was removed ")
        }
    }

    init() {
        var self = this;
        Notifications.addNewBoxAddedListener(function (boxInfo) {
            var box = Boxes._createBox(boxInfo);
            Boxes._addNewBox(self.boxes, box);
        });

        Notifications.addBoxRemovedListener(function (box) {
            Boxes._removeBox(self.boxes, box.id);
        });
    }

    toString() {
        return `{\n` +
            `\t"boxes": [${this.boxes}]\n` +
            `}`;
    }

    static loadBoxes(callback) {
        console.log("Loading boxes from the store...");
        chrome.storage.local.get(["tabsBoxes"], function (item) {
            var boxes = new Boxes(item.tabsBoxes);
            boxes.init();
            console.log("Boxes=" + boxes + " was loaded from the store");
            callback(boxes);
        });
    }

    static _createBox(boxInfo) {
        var box = new Box(boxInfo.id, boxInfo.name, boxInfo.tabs);
        box.init();
        return box;
    }

    static _addNewBox(boxes, box) {
        boxes.push(box);
        return true;
    }

    static _removeBox(boxes, boxId) {
        var box = Boxes._getBoxById(boxes, boxId);
        if (box !== null) {
            boxes.splice(boxes.indexOf(box), 1);
            return true;
        }
        return false;
    }

    static _getBoxById(boxes, id) {
        var foundBoxes = boxes.filter(function (box) {
            return box.id === id;
        });
        if (foundBoxes.length !== 0) {
            return foundBoxes[0];
        }
        return null;
    }
}