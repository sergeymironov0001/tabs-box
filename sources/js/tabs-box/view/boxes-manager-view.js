class BoxesManagerView extends ListView {

    constructor(model, mvcResolver) {
        super(model, model.getBoxes(), mvcResolver);
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
        this._addExpandAllBoxesAction();
        this._addCollapseAllBoxesAction();

        this._changeBoxesFilterAction();

        this.items.forEach(item => {
            item.init();
        });
        this._initBoxesDragAndDrop();
        this._initTabsDragAndDrop();
    }

    _addStarTabDragAndDropListener(boxView) {
        boxView.addListener(event => {
            this.items.forEach(item => {
                if (event.source === item) {
                    return;
                }
                let tab = item.model.getTabByUrl(event.data.tabUrl);
                if (tab) {
                    item.disableDragAndDrop();
                }
            }, "boxView/sortStarted");
        });
    }

    _addStopTabDragAndDropListener(boxView) {
        boxView.addListener(event => {
            this.items.forEach(item => {
                if (event.source === item) {
                    return;
                }
                item.enableDragAndDrop();
            });
        }, "boxView/sortStopped");
    }

    _updateView(event) {
        switch (event.type) {
            case "boxAdded": {
                let item = this._addItem(event.data);
                this._addItemToHtml(item);
                item.init();

                this._updateBoxesDragAndDrop();
                this._initTabsDragAndDrop(event.data.id);
                break;
            }
            case "boxRemoved": {
                let item = this._removeItem(event.data);
                item.remove();
                break;
            }
        }
    }

    _updateBoxesDragAndDrop() {
        sortable('#boxes');
    }

    _initBoxesDragAndDrop() {
        sortable('#boxes', {
            handle: '.box-name',
            forcePlaceholderSize: true
        }).forEach(item =>
            item.addEventListener('sortupdate', event => {
                let boxId = event.detail.item.id.substr(4);
                this._notifyListeners("boxManagerView/boxPositionChangedAction", {
                    boxId: boxId,
                    newPosition: event.detail.destination.index
                });
            }));
    }

    _initTabsDragAndDrop() {
        sortable('.box-content', {
            handle: '.tab-title',
            connectWith: '.box-content',
            forcePlaceholderSize: true,
            dropZoneClass: "drop-zone"
        }).forEach(item =>
            item.addEventListener('sortupdate',
                event => {
                    console.log(event);
                    let oldBoxId = $("#" + event.detail.origin.container.id)
                        .parent()
                        .attr('id')
                        .substr(4);
                    let newBoxId = $("#" + event.detail.destination.container.id)
                        .parent()
                        .attr('id')
                        .substr(4);
                    let tabId = event.detail.item.id.substr(4);
                    this._notifyListeners("boxesManagerView/tabMovedAction", {
                        oldBoxId: oldBoxId,
                        newBoxId: newBoxId,
                        tabId: tabId,
                        tabPosition: event.detail.destination.index
                    });
                }));
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

    _addExpandAllBoxesAction() {
        $('#expand-all-boxes-button').click(e =>
            this._notifyListeners(
                "boxesManagerView/expandAllBoxesAction"));
    }

    _addCollapseAllBoxesAction() {
        $('#collapse-all-boxes-button').click(e =>
            this._notifyListeners(
                "boxesManagerView/collapseAllBoxesAction"));
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