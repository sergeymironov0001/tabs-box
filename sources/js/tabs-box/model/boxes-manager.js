class BoxesManager extends Observable {

    static loadBoxes(callback) {
        LocalStorageUtils.loadBoxes(boxesInfo => {
            let boxesManger = new BoxesManager(boxesInfo);
            callback(boxesManger);
        });
    }

    static saveBoxes(boxesManager, callback) {
        LocalStorageUtils.saveBoxes(boxesManager.getBoxes(), callback);
    }

    static _createBox(boxInfo) {
        return new Box(boxInfo.id, boxInfo.name,
            boxInfo.showContent, boxInfo.tabs);
    }

    constructor(boxesInfo) {
        super();
        this.boxes = [];

        if (boxesInfo) {
            boxesInfo.forEach(boxInfo => {
                if (boxInfo && boxInfo != null) {
                    let box = BoxesManager._createBox(boxInfo);
                    ArrayUtils.addItem(this.boxes, box);
                }
            });
        }
    }

    getBoxById(id) {
        return ArrayUtils.getItemById(this.boxes, id);
    }

    getBoxes() {
        return this.boxes;
    }

    addBox(boxInfo) {
        let box = boxInfo
            ? new Box(boxInfo.id, boxInfo.name, boxInfo.showContent, boxInfo.tab)
            : new Box();
        if (ArrayUtils.addItem(this.boxes, box)) {
            this._notifyListeners("boxAdded", box);
            return box;
        }
        return undefined;
    }

    removeBox(id) {
        if (ArrayUtils.removeItemById(this.boxes, id)) {
            this._notifyListeners("boxRemoved", id);
        }
    }

    changeBoxPosition(boxId, newPosition) {
        if (ArrayUtils.changeItemPosition(this.boxes, boxId, newPosition)) {
            this._notifyListeners("boxPositionChanged", {
                boxId: boxId,
                newPosition: newPosition
            });
        }
    }

    moveTabToAnotherBox(tabId, oldBoxId, newBoxId, newTabPosition) {
        let oldBox = this.getBoxById(oldBoxId);
        let newBox = this.getBoxById(newBoxId);
        if (!oldBox || !newBox) {
            return;
        }
        let tab = oldBox.getTabById(tabId);
        if (!tab) {
            return;
        }
        if (newBox.addTab(tab, newTabPosition)) {
            oldBox.removeTab(tab.id);
        } else {
            this._notifyListeners("tabCanNotBeMovedToBox", {
                tabId: tabId,
                oldBoxId: oldBoxId,
                newBoxId: newBoxId
            });
        }
    }

    filterBoxesByTabs(filterQuery) {
        if (!filterQuery || filterQuery.length === 0) {
            return this.getBoxes();
        }
        filterQuery = filterQuery.toLowerCase();
        return this.getBoxes().filter(box =>
            box.filterTabs(filterQuery).length > 0);
    }

    collapseBoxes() {
        this.boxes.forEach(box => box.collapse());
    }

    expandBoxes() {
        this.boxes.forEach(box => box.expand());
    }

    // searchBoxesByName(searchQuery) {
    //     searchQuery = searchQuery.toLowerCase();
    //     return this.getBoxes().filter(box =>
    //         box.name.toLowerCase().indexOf(searchQuery) !== -1);
    // }
    //
    // searchBoxesByNameAndTabs(searchQuery) {
    //     searchQuery = searchQuery.toLowerCase();
    //     return this.getBoxes().filter(box =>
    //         box.name.toLowerCase().indexOf(searchQuery) !== -1
    //         || box.searchTabs(searchQuery).length > 0);
    // }

    toString() {
        return `{\n` +
            `\t"boxes": [${this.boxes}]\n` +
            `}`;
    }
}