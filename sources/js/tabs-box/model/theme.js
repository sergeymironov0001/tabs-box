class Theme {
    constructor(name, cssClass) {
        this.name = name;
        this.cssClass = cssClass;
    }

    toString() {
        return `Theme.(${this.name},${this.cssClass})`;
    }
}