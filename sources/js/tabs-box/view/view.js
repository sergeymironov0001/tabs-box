class View {

    constructor(data) {
        this.data = data;
        this.eventsListeners = [];
    }

    getElement() {
        // child has to implement this
    }

    __generateElement() {
        // child has to implement this
    }

    __addButtonsListeners() {
        // child has to implement this
    }

    getData() {
        return this.data;
    }

    outputView(parentElement) {
        if (parentElement) {
            parentElement.append(this.__generateElement());
        }
        this.__addButtonsListeners();
    }

    deleteElement() {
        this.getElement().remove();
    }

    show() {
        this.getElement().removeAttr("hidden");
    }

    hide() {
        this.getElement().attr("hidden", "hidden");
    }

    addEventsListener(listener) {
        this.eventsListeners.push(listener);
    }

    __notifyListeners(eventType) {
        console.log(this.eventsListeners);
        var self = this;
        this.eventsListeners.forEach(function (listener) {
            listener(self, eventType);
        });
    }
}