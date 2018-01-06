class Box {

    constructor(id, name, tabs) {
        this.id = id ? id : Box._generateUniqueId();
        this.name = name ? name : "Tabs box";
        if (tabs && tabs.length > 0) {
            this.tabs = $.map(tabs, function (tabInfo) {
                return new Tab(tabInfo.id, tabInfo);
            });
        } else {
            this.tabs = [];
        }
    }

    getName() {
        return this.name;
    }

    getTabByUrl(url) {
        return Box._getTabByUrl(this.tabs, url);
    }

    getTabs() {
        return this.tabs;
    }

    changeName(name) {
        this.name = name;
        Notifications.sendBoxNameChanged(this);
    }

    putTabToBox(tabInfo) {
        if (Box._putTabToBox(this.tabs, tabInfo)) {
            Notifications.sendPutTabToBox(this.id, tabInfo);
        }
    }

    removeTabFromBox(tabInfo) {
        if (Box._removeTabFromBox(this.tabs, tabInfo)) {
            Notifications.sendTabFromBoxRemoved(this.id, tabInfo);
        }
    }

    changeTabPosition(tabId, newPosition) {
        Box._changeTabPosition(this.tabs, tabId, newPosition);
        Notifications.sendChangeTabPosition(this.id, tabId, newPosition);
    }

    init() {
        var self = this;
        Notifications.addChangeBoxNameListener(this.id, function (name) {
            console.log("Sync box nam - id: " + self.id + ", name: " + name);
            self.name = name;
        });

        Notifications.addPutTabToBoxListener(this.id, function (tab) {
            console.log("Sync add tab to box - id: " + self.id + ", tab: " + tab);
            Box._putTabToBox(self.tabs, tab);
        });

        Notifications.addRemoveTabFromBoxListener(this.id, function (tab) {
            console.log("Sync remove tab from box: id: " + self.id + ", tab: " + tab);
            Box._removeTabFromBox(self.tabs, tab);
        });

        Notifications.addChangeTabPositionListener(this.id, function (tabId, newPosition) {
            Box._changeTabPosition(self.tabs, tabId, newPosition);
        });
    }

    toString() {
        return `{\n` +
            `\t"id": ${this.id},\n` +
            `\t"name": ${this.name},\n` +
            `\t"tabs": [${this.tabs.join(", ")}]\n` +
            `}`;
    }

    static _generateUniqueId() {
        return Math.random().toString(36).substr(2, 16);
    }

    static _getTabByUrl(tabs, url) {
        var foundTabs = tabs.filter(function (tab) {
            return tab.url === url;
        });
        if (foundTabs.length !== 0) {
            return foundTabs[0];
        }
        return null;
    }

    static _getTabById(tabs, id) {
        var foundTabs = tabs.filter(function (tab) {
            return tab.id === id;
        });
        if (foundTabs.length !== 0) {
            return foundTabs[0];
        }
        return null;
    }

    static _putTabToBox(tabs, tab) {
        var foundTab = Box._getTabByUrl(tabs, tab.url);
        if (!foundTab) {
            tabs.push(tab);
            return true;
        }
        return false;
    }

    static _changeTabPosition(tabs, tabId, newIndex) {
        var tab = Box._getTabById(tabs, tabId);
        console.log("Tab to change position: " + tab);
        if (tab) {
            var oldIndex = tabs.indexOf(tab);
            var tmp = tabs[newIndex];
            tabs[newIndex] = tab;
            tabs[oldIndex] = tmp;
        }
    }

    static _removeTabFromBox(tabs, tabInfo) {
        var index = tabs.indexOf(tabInfo);
        if (index >= 0) {
            tabs.splice(index, 1);
            return true;
        }
        return false;
    }
}

