class Tab extends Observable {

    constructor(id, tabInfo) {
        super();

        this.id = id || CommonUtils.generateUniqueId();
        this.url = tabInfo.url;
        this.title = tabInfo.title;
        this.favIconUrl = tabInfo.favIconUrl;
        this._init();
    }

    changeTitle(newTitle) {
        this.title = newTitle;
        this._notifyListeners("titleChanged", newTitle)
    }

    changeUrl(newUrl) {
        this.url = newUrl;
        this._notifyListeners("urlChanged", newUrl);
    }

    toString() {
        return `{ "id": "${this.id}", "title": "${this.title}" }`;
    }

    _init() {
        NotificationUtils.addChangeTabTitleAndUrlListener(this.id, (title, url) => {
            this.changeTitle(title);
            this.changeUrl(url)
        });
    }
}