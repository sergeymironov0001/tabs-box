class Observable {

    constructor() {
        this.listeners = [];
    }

    addListener(listener, eventType) {
        this.listeners.push({
            listener: listener,
            eventType: eventType
        });
    }

    removeListener(listener) {
        // TODO implement
    }

    _notifyListeners(type, data) {
        let event = {
            source: this,
            type: type,
            data: data
        };

        this.listeners.forEach(item => {
            if (!item.eventType) {
                item.listener(event);
            } else if (item.eventType === type) {
                item.listener(event);
            }
        });

        Observable.globalListeners.forEach(item => {
            if (item.classes.indexOf(this.constructor.name) >= 0) {
                item.listener(event, this.constructor.name);
            }
        });
    }

    static addGlobalListener(listener, classes) {
        Observable.globalListeners.push({
            listener: listener,
            classes: classes
        });
    }
}

Observable.globalListeners = [];
