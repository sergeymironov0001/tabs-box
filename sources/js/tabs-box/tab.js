class Tab {

    constructor(id, tabInfo, thumbImgUrl) {
        this.id = id ? id : Tab._generateUniqueId();
        this.url = tabInfo.url;
        this.title = tabInfo.title;
        this.favIconUrl = tabInfo.favIconUrl;
        this.thumbImgUrl = thumbImgUrl ? thumbImgUrl : tabInfo.thumbImgUrl;
    }

    toString() {
        return `{ "id": "${this.id}", "title": "${this.title}" }`;
    }

    static _generateUniqueId() {
        return Math.random().toString(36).substr(2, 16);
    }
}