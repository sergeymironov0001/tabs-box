class Tab {

    constructor(id, tabInfo, thumbImgUrl) {
        this.id = id ? id : Tab._generateUniqueId();
        this.url = tabInfo.url;
        this.title = tabInfo.title;
        this.favIconUrl = tabInfo.favIconUrl;
        this.thumbImgUrl = thumbImgUrl ? thumbImgUrl : tabInfo.thumbImgUrl;
    }

    getUrl() {
        return this.url;
    }

    getTitle() {
        return this.url;
    }

    getFaviconUrl() {
        return this.faviconUrl;
    }

    getThumbImgUrl() {
        return this.thumbImgUrl;
    }

    toString() {
        return `{ "id": "${this.id}", "title": "${this.title}" }`;
    }

    static _generateUniqueId() {
        return Math.random().toString(36).substr(2, 16);
    }
}