class View extends Observable {

    constructor(model) {
        super();
        this.id = model.id;
        this.model = model;
    }

    getHtml() {
    }

    getElement() {
        return $(this.id);
    }

    remove() {
        this.getElement().remove();
    }

    show() {
        this.getElement().removeAttr("hidden");
    }

    hide() {
        this.getElement().attr("hidden", "hidden");
    }
}