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

    showBoxContent(boxId) {
        console.log("show box content: boxId=" + boxId);
        var box = this.getBoxById(boxId);
        if (box) {
            box.showContent = true;
            this.saveBoxes();
        }
    }

    hideBoxContent(boxId) {
        console.log("hide box content: boxId=" + boxId);
        var box = this.getBoxById(boxId);
        if (box) {
            box.showContent = false;
            this.saveBoxes();
        }
    }

    addNewBox() {
        console.log("Adding new box...");
        var box = new Box();
        box.init();
        if (Boxes._addNewBox(this.boxes, box)) {
            this.saveBoxes();
            Notifications.sendNewBoxAdded(box);
            console.log("New box=" + box + " was added");
        }
        return box;
    }

    saveBoxes() {
        // console.log("Saving boxes=" + this.boxes + " ...");
        var self = this;
        chrome.storage.local.set({tabsBoxes: this.boxes}, function () {
            // console.log("Boxes=" + self.boxes + " was saved");
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
        var box = this.getBoxById(boxId);
        if (box && box !== null) {
            if (box.putTabToBox(tab)) {
                this.saveBoxes();
                console.log("Tab=" + tab + " was put to the box with id=" + boxId);
                return true;
            }
        }
        return false;
    }

    changeTabTitleAndUrl(boxId, tabId, title, url) {
        var box = this.getBoxById(boxId);
        if (box && box !== null) {
            if (box.changeTabTitleAndUrl(tabId, title, url)) {
                this.saveBoxes();
                return true;
            }
        }
        return false;
    }

    moveTabToBox(originBoxId, destinationBoxId, tabId, tabPosition) {
        var originBox = this.getBoxById(originBoxId);
        var tab = originBox.getTabById(tabId);
        var destinationBox = this.getBoxById(destinationBoxId);
        if (originBox && originBox !== null && destinationBox && destinationBox !== null && tab && tab != null) {
            if (originBox.removeTabFromBox(tabId) && destinationBox.putTabToBox(tab)) {
                destinationBox.changeTabPosition(tabId, tabPosition);
                this.saveBoxes();
                return true;
            }
        }
        return false;
    }

    changeTabPosition(boxId, tabId, newPosition) {
        console.log("Change tab position: boxId=" + boxId + ", tabId=" + tabId + ", newPosition=" + newPosition);
        var box = this.getBoxById(boxId);
        if (box && box != null) {
            box.changeTabPosition(tabId, newPosition);
            this.saveBoxes();
        }
    }

    removeTabFromBox(boxId, tabId, callback) {
        console.log("Removing tab=" + tabId + " from the box with id=" + boxId + " ...");
        var box = this.getBoxById(boxId);
        if (box && box !== null) {
            if (box.removeTabFromBox(tabId)) {
                this.saveBoxes();
                if (callback) {
                    callback();
                }
                console.log("Tab=" + tabId + " was removed form the box with id=" + boxId);
            }
        }
    }

    changeBoxPosition(boxId, newPosition) {
        console.log("Change box position: boxId=" + boxId + ", newPosition=" + newPosition);
        var box = this.getBoxById(boxId);
        if (box) {
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

    searchBoxesByName(searchQuery) {
        searchQuery = searchQuery.toLowerCase();
        return this.getBoxes().filter(function (box) {
            return box.name.toLowerCase().indexOf(searchQuery) !== -1;
        });
    }

    searchBoxesByTabs(searchQuery) {
        searchQuery = searchQuery.toLowerCase();
        return this.getBoxes().filter(function (box) {
            if (box.searchTabs(searchQuery).length > 0) {
                return true;
            }
            return false;
        });
    }

    searchBoxesByNameAndTabs(searchQuery) {
        searchQuery = searchQuery.toLowerCase();
        return this.getBoxes().filter(function (box) {
            return box.name.toLowerCase().indexOf(searchQuery) !== -1 || box.searchTabs(searchQuery).length > 0;
        });
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
        var box = new Box(boxInfo.id, boxInfo.name, boxInfo.showContent, boxInfo.tabs);
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