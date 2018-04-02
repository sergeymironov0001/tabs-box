class BoxesManagerView extends ListView {

    constructor(model, mvcResolver) {
        super(model, model.getBoxes(), mvcResolver);

        this.addListener(function (event) {
            switch (event.type) {
                case 'addBox':
                    sortable('#boxes');
                    break;
            }
        });
    }

    getHtml() {
        let html = " ";
        this.items.forEach(item => {
            html = this._addItemToHtml(item, html);
        });
        return html;
    }

    getElement() {
        return $("#boxes");
    }

    init() {
        this.model.addListener(event => this._updateView(event));

        this._addPutOpenedTabsToNewBoxAction();
        this._addAddEmptyBoxAction();
        this._addOpenOptionsAction();
        this._changeBoxesFilterAction();

        this.items.forEach(item => item.init());
        this._initDragAndDrop();
    }

    _initDragAndDrop() {
        sortable('#boxes', {
            handle: '.box-name',
            forcePlaceholderSize: true
        });

        sortable('#boxes')[0].addEventListener('sortupdate', event => {
            let boxId = event.detail.item.id.substr(4);
            this._notifyListeners("boxManagerView/boxPositionChangedAction", {
                boxId: boxId,
                newPosition: event.detail.index
            });
        });
    }

    _updateView(event) {
        switch (event.type) {
            case "boxAdded": {
                let item = this._addItem(event.data);
                this._addItemToHtml(item);
                item.init();
                break;
            }
            case "boxRemoved": {
                let item = this._removeItem(event.data);
                item.remove();
                break;
            }
        }
    }

    _addItem(itemModel) {
        let item = super._addItem(itemModel);
        if (item) {
            item.addListener(event =>
                this._notifyListeners("boxesManagerView/removeBoxAction",
                    event.source), "boxView/removeBoxAction");
        }
        return item;
    }

    _addItemToHtml(item, html) {
        let dom = html ? HtmlUtils.htmlToDom(html) : $('#boxes');
        dom.append(item.getHtml());
        return dom.html();
    }

    _addPutOpenedTabsToNewBoxAction() {
        $('#put-opened-tabs-to-new-box-button').click(e =>
            this._notifyListeners(
                "boxesManagerView/putOpenedTabsToNewBoxAction"));
    }

    _addAddEmptyBoxAction() {
        $('#create-new-box-button').click(e => {
            this._notifyListeners("boxesManagerView/addEmptyBoxAction")
        });
    }

    _addOpenOptionsAction() {
        $('#open-options-button').click(e => {
            this._notifyListeners("boxesManagerView/openOptionsAction")
        });
    }

    _changeBoxesFilterAction() {
        $('#search-input').on('input', e => {
            let filterQuery = e.target.value;
            this.filterItems(filterQuery);
        });
    }

    filterItems(filterQuery) {
        if (filterQuery) {
            this._hideItems();
            let filteredBoxes = this.model.filterBoxesByTabs(filterQuery);
            filteredBoxes.forEach(box => {
                let boxView = this._getItem(box.id);
                boxView.show();
                if (!box.showContent) {
                    boxView.expand();
                }
                boxView.filterItems(filterQuery);
            });
        } else {
            this._getItems().forEach(boxView => {
                boxView.show();
                boxView.model.showContent ? boxView.expand()
                    : boxView.collapse();
                boxView.filterItems(filterQuery);
            });
        }
    }
}