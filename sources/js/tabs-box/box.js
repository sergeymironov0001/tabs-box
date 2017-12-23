function Box(id, name, tabs) {

    this.id = id ? id : generateUniqueId();
    this.name = name ? name : "Tabs box";
    this.tabs = tabs ? tabs : [];

    function generateUniqueId() {
        return Math.random().toString(36).substr(2, 16);
    }

    function _getTabByUrl(tabs, url) {
        var foundTabs = tabs.filter(function (tab) {
            return tab.url === url;
        });
        if (foundTabs.length !== 0) {
            return foundTabs[0];
        }
        return null;
    }

    function _putTabToBox(tabs, tab) {
        var foundTab = _getTabByUrl(tabs, tab.url);
        if (!foundTab) {
            tab.id = generateUniqueId();
            tabs.push(tab);
            return true;
        }
        return false;
    }

    function _removeTabFromBox(tabs, tabInfo) {
        var index = tabs.indexOf(tabInfo);
        if (index >= 0) {
            tabs.splice(index, 1);
            return true;
        }
        return false;
    }

    this.getName = function () {
        return name;
    };

    this.getTabByUrl = function (url) {
        return _getTabByUrl(url);
    };

    this.getTabs = function () {
        return tabs;
    };

    this.changeName = function (name) {
        this.name = name;
        Notifications.sendBoxNameChanged(this);
    };

    this.putTabToBox = function (tabInfo) {
        if (_putTabToBox(this.tabs, tabInfo)) {
            Notifications.sendPutTabToBox(this.id, tabInfo);
        }
    };

    this.removeTabFromBox = function (tabInfo) {
        if (_removeTabFromBox(this.tabs, tabInfo)) {
            Notifications.sendTabFromBoxRemoved(this.id, tabInfo);
        }
    };

    this.init = function () {
        var self = this;
        Notifications.addChangeBoxNameListener(this.id, function (name) {
            console.log("Sync box nam - id: " + self.id + ", name: " + name);
            self.name = name;
        });

        Notifications.addPutTabToBoxListener(this.id, function (tab) {
            console.log("Sync add tab to box - id: " + self.id + ", tab: " + tab);
            _putTabToBox(self.tabs, tab);
        });

        Notifications.addRemoveTabFromBoxListener(this.id, function (tab) {
            console.log("Sync remove tab from box: id: " + self.id + ", tab: " + tab);
            _removeTabFromBox(self.tabs, tab);
        });
    };
}

