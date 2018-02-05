class ListView extends View {

    constructor(itemsContainer, items) {
        super(itemsContainer);
        this.itemViews = [];

        var views = this.__createItemViews(items);
        var self = this;
        views.forEach(function (itemView) {
            self.__addItemView(itemView);
        });
    }

    __getParentElementForItemViews() {
        // child has to implement this
    }

    __getItemViewsEventListener() {
        // child has to implement this
    }

    __createItemView(item) {
        // child has to implement this
    }

    __createItemViews(items) {
        var self = this;
        return items.map(function (data) {
            return self.__createItemView(data);
        });
    }

    __addItemView(itemView) {
        this.itemViews.push(itemView);
        itemView.addEventsListener(this.__getItemViewsEventListener());
    }

    __deleteItemView(itemView) {
        var views = this.itemViews;
        views.splice(views.indexOf(itemView), 1);
    }

    outputView(parentElement) {
        if (parentElement) {
            parentElement.append(this.__generateElement());
        }
        this.__outputItemViews();
        this.__addButtonsListeners();
    }

    __outputItemViews() {
        var self = this;
        var itemViews = this.itemViews;
        if (itemViews) {
            itemViews.forEach(function (itemView) {
                self.__outputItemView(itemView);
            });
        }
    }

    __createAddAndOutputItemView(item) {
        var itemView = this.__createItemView(item);
        this.__addItemView(itemView);
        this.__outputItemView(itemView);
    }

    __outputItemView(itemView) {
        itemView.outputView(this.__getParentElementForItemViews());
    }

    __hideItemViews(itemViews) {
        if (!itemViews) {
            itemViews = this.itemViews;
        }
        itemViews.forEach(function (view) {
            view.hide();
        });
    }

    __showItemViews(itemViews) {
        if (!itemViews) {
            itemViews = this.itemViews;
        }

        itemViews.forEach(function (view) {
            view.show();
        });
    }

    __getItemViews(items) {
        var self = this;
        return items.map(function (item) {
            return self.__getItemView(item);
        })
    }

    __getItemView(item) {
        var views = this.itemViews.filter(function (view) {
            return view.getData() === item;
        });
        if (views && views.length > 0) {
            return views[0];
        }
        return undefined;
    }
}