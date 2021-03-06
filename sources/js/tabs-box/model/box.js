class Box extends Observable {

    constructor(id, name, showContent, tabs) {
        super();

        this.id = id || CommonUtils.generateUniqueId();
        this.name = name || "Box [" + new Date().toLocaleString() + "]";
        this.showContent = showContent || false;
        this.tabs = [];
        if (tabs) {
            this.tabs = $.map(tabs, tabInfo => new Tab(tabInfo.id, tabInfo));
        }
    }

    getTabs() {
        return this.tabs;
    }

    getTabById(tabId) {
        return ArrayUtils.getItemById(this.tabs, tabId);
    }

    getTabByUrl(url) {
        return ArrayUtils.getItemByField(this.tabs, "url", url);
    }

    changeName(name) {
        this.name = name;
        this._notifyListeners("nameChanged", name);
    }

    addTab(tabInfo, position) {
        if (ArrayUtils.getItemByField(this.tabs, "url", tabInfo.url)) {
            return false;
        }
        let tab = new Tab(tabInfo.id, tabInfo);
        if (ArrayUtils.addItem(this.tabs, tab, position)) {
            this._notifyListeners("tabAdded", {
                tab: tab,
                position: position
            });
            this._notifyListeners("tabsCountChanged", this.tabs.length);
            return true;
        }
        return false;
    }

    removeTab(tabId) {
        if (ArrayUtils.removeItemById(this.tabs, tabId)) {
            this._notifyListeners("tabRemoved", tabId);
            this._notifyListeners("tabsCountChanged", this.tabs.length);
            return true;
        }
        return false;
    }

    changeTabPosition(tabId, newPosition) {
        if (ArrayUtils.changeItemPosition(this.tabs, tabId, newPosition)) {
            this._notifyListeners("tabPositionChanged", {
                tabId: tabId,
                newPosition: newPosition
            });
        }
    }

    expand() {
        if (!this.showContent) {
            this.showContent = true;
            this._notifyListeners("boxExpanded");
        }
    }

    collapse() {
        if (this.showContent) {
            this.showContent = false;
            this._notifyListeners("boxCollapsed")
        }
    }

    toggle() {
        if (this.showContent) {
            this.collapse();
        } else {
            this.expand();
        }
    }

    filterTabs(query) {
        return this.tabs.filter(tab =>
            tab.title.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }

    getTabsCount() {
        return this.tabs.length;
    }

    toString() {
        return `{\n` +
            `\t"id": ${this.id},\n` +
            `\t"name": ${this.name},\n` +
            `\t"showContent": ${this.showContent},\n` +
            `\t"tabs": [${this.tabs.join(", ")}]\n` +
            `}`;
    }
}

