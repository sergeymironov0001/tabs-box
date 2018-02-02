class View {

    constructor() {
        this.eventsListeners = [];

        this.subViewEventListener = function () {
        };
    }

    outputView(parentElement) {
        if (parentElement) {
            parentElement.append(this.__generateElement());
        }
        this.__outputSubViews();
        this.__addButtonsListeners();
    }

    deleteElement() {
        this.getElement().remove();
    }

    show() {
        this.getElement().attr("hidden", "hidden");
    }

    hide() {
        this.getElement().removeAttr("hidden");
    }

    addEventsListener(listener) {
        this.eventsListeners.push(listener);
    }

    __outputSubViews() {
        var self = this;
        var subViews = this.__getSubViews();
        if (subViews) {
            subViews.forEach(function (subView) {
                self.__outputSubView(subView);
            });
        }
    }

    __createAddAndOutputSubView(data) {
        var subView = this.__createSubView(data);
        this.__addSubView(subView);
        this.__outputSubView(subView);
    }

    __createSubViews(subData) {
        var self = this;
        return subData.map(function (data) {
            return self.__createSubView(data);
        });
    }

    __addSubView(subView) {
        this.__getSubViews().push(subView);
        subView.addEventsListener(this.subViewEventListener);
    }

    __deleteSubView(subView) {
        var subViews = this.__getSubViews();
        subViews.splice(subViews.indexOf(subView), 1);
    }

    __notifyListeners(eventType) {
        var self = this;
        this.eventsListeners.forEach(function (listener) {
            listener(self, eventType);
        });
    }

    getElement() {
        // child has to implement this
    }

    __createSubView(tab) {
        // child has to implement this
    }

    __getSubViews() {
        // child has to implement this
    }

    __outputSubView(subView) {
        // child has to implement this
    }

    __generateElement() {
        // child has to implement this
    }

    __addButtonsListeners() {
        // child has to implement this
    }
}