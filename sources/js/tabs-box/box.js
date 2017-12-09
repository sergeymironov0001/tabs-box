function Box() {
    var tabs = [];
    this.id = "";
    this.name = "Tabs box";

    function generateUniqueId() {
        return Math.random().toString(36).substr(2, 16);
    }

    this.tabWithTheSameUrlAlreadyExists = function (newTab) {
        var tabsWithTheSameUrl = tabs.filter(function (e) {
            return e.url === newTab.url;
        });
        return tabsWithTheSameUrl.length !== 0;
    };

    this.putTabInBox = function (tab) {
        if (!this.tabWithTheSameUrlAlreadyExists(tab)) {
            tab.id = generateUniqueId();
            tabs.push(tab);
        }
    };

    this.deleteTab = function (tab) {
        tabs.splice(tab.indexOf(tab), 1);
    };

    this.getTabs = function () {
        return tabs;
    };
}

