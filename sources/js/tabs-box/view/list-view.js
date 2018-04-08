class ListView extends View {

    constructor(model, itemModels, mvcResolver) {
        super(model);

        this.mvcResoler = mvcResolver;
        this.items = [];
        this._addItems(itemModels);
    }

    _addItem(itemModel, position) {
        let view = this.mvcResoler.createView(itemModel);
        if (ArrayUtils.addItem(this.items, view, position)) {
            return view;
        }
        return undefined;
    }

    _addItems(itemModels) {
        return $.map(itemModels, item => this._addItem(item));
    }

    _removeItem(id) {
        let view = this._getItem(id);
        if (view) {
            ArrayUtils.removeItemById(this.items, id);
        }
        return view;
    }

    _hideItems(ids) {
        this._getItems(ids).forEach(view => view.hide());
    }

    _showItems(ids) {
        this._getItems(ids).forEach(view => view.show());
    }

    _getItem(id) {
        let views = this.items.filter(view => view.id === id);
        if (views && views.length > 0) {
            return views[0];
        }
        return undefined;
    }

    _getItems(ids) {
        if (ids) {
            return ids.map(id => this._getItem(id));
        }
        return this.items;
    }
}
