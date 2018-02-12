class ListView extends View {

    constructor(itemsContainer, items) {
        super(itemsContainer);
        this.itemViews = [];

        var views = this._createItemViews(items);
        var self = this;
        views.forEach(function (itemView) {
            self._addItemView(itemView);
        });
    }

    _getParentElementForItemViews() {
        // child has to implement this
    }

    _getItemViewsEventListener() {
        // child has to implement this
    }

    _createItemView(item) {
        // child has to implement this
    }

    _createItemViews(items) {
        var self = this;
        return items.map(function (data) {
            return self._createItemView(data);
        });
    }

    _addItemView(itemView) {
        this.itemViews.push(itemView);
        itemView.addEventsListener(this._getItemViewsEventListener());
    }

    _deleteItemView(itemView) {
        var views = this.itemViews;
        views.splice(views.indexOf(itemView), 1);
    }

    outputView(parentElement) {
        if (parentElement) {
            parentElement.append(this._generateElement());
        }
        this._outputItemViews();
        this._addButtonsListeners();
    }

    _outputItemViews() {
        var self = this;
        var itemViews = this.itemViews;
        if (itemViews) {
            itemViews.forEach(function (itemView) {
                self._outputItemView(itemView);
            });
        }
    }

    _createAddAndOutputItemView(item) {
        var itemView = this._createItemView(item);
        this._addItemView(itemView);
        this._outputItemView(itemView);
    }

    _outputItemView(itemView) {
        itemView.outputView(this._getParentElementForItemViews());
    }

    _hideItemViews(itemViews) {
        if (!itemViews) {
            itemViews = this.itemViews;
        }
        itemViews.forEach(function (view) {
            view.hide();
        });
    }

    _showItemViews(itemViews) {
        if (!itemViews) {
            itemViews = this.itemViews;
        }

        itemViews.forEach(function (view) {
            view.show();
        });
    }

    _getItemViews(items) {
        var self = this;
        return items.map(function (item) {
            return self._getItemView(item);
        })
    }

    _getItemView(item) {
        var views = this.itemViews.filter(function (view) {
            return view.getData() === item;
        });
        if (views && views.length > 0) {
            return views[0];
        }
        return undefined;
    }
}