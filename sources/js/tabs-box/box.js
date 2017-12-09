function Box() {
    var tabs = [];
    this.id = "";
    this.name = "Tabs box";

    function generateUniqueId() {
        return Math.random().toString(36).substr(2, 16);
    }

    this.tabWithTheSameUrlAlreadyExists = function (newTabInfo) {
        var tabsWithTheSameUrl = tabs.filter(function (e) {
            return e.url === newTabInfo.url;
        });
        return tabsWithTheSameUrl.length !== 0;
    };

    this.putTabInBox = function (tabInfo) {
        if (!this.tabWithTheSameUrlAlreadyExists(tabInfo)) {
            tabInfo.id = generateUniqueId();
            tabs.push(tabInfo);
        }
    };

    this.deleteTab = function (tabInfo) {
        var index = tabs.indexOf(tabInfo);
        if (index >= 0) {
            tabs.splice(index, 1);
        }
    };

    this.getTabs = function () {
        return tabs;
    };
}

