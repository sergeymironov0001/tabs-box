class View {

    constructor(data) {
        this.data = data;
        this.eventsListeners = [];
    }

    getElement() {
        // child has to implement this
    }

    _generateElement() {
        // child has to implement this
    }

    _addButtonsListeners() {
        // child has to implement this
    }

    getData() {
        return this.data;
    }

    outputView(parentElement) {
        if (parentElement) {
            parentElement.append(this._generateElement());
        }
        this._addButtonsListeners();
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

    _notifyListeners(eventType) {
        console.log(eventType);
        var self = this;
        this.eventsListeners.forEach(function (listener) {
            listener(self, eventType);
        });
    }
}