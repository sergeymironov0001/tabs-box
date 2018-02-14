class BoxesView extends ListView {

    constructor(boxes) {
        super(boxes, boxes.getBoxes());

        this.addEventsListener(function (boxesView, type) {
            switch (type) {
                case 'addBox':
                    sortable('#boxes');
                    break;
            }
        });
    }

    _getItemViewsEventListener() {
        var self = this;
        return function (boxView, type) {
            switch (type) {
                case 'addTab':
                    sortable('.box-content');
                    console.log("Box content sotrable updated");
                    break;
                case 'delete':
                    self._deleteItemView(boxView);
                    self.getData().removeBox(boxView.getData());
                    break;
                case 'edit':
                    self.getData().changeBoxName(boxView.getData().id, boxView.getData().name);
                    break;
            }
        }
    }

    _createItemView(box) {
        return new BoxView(this.getData(), box);
    }

    _getParentElementForItemViews() {
        return $('#boxes');
    }

    _outputItemView(boxView) {
        console.log(boxView);
        boxView.outputView(this._getParentElementForItemViews());
        if (boxView.getData().showContent) {
            boxView.expand();
        }
    }

    _createNewEmptyBox() {
        var box = this.getData().addNewBox();
        var boxView = this._createItemView(box);
        this._addItemView(boxView);
        this._outputItemView(boxView);

    }

    _putCurrentTabToNewBox() {
        var self = this;
        var box = this.getData().addNewBox();

        Tabs.getCurrentTab(function (activeTab) {
            Tabs.getCurrentTabPicture(function (snapshotImageUrl) {
                var tab = new Tab(null, activeTab, snapshotImageUrl);
                if (!self.getData().putTabToBox(box.id, tab)) {
                    return;
                }
                self.getData().showBoxContent(box.id);
                self._createAddAndOutputItemView(box);
            });
        });
    }

    _addButtonsListeners() {
        var self = this;
        $('#create-empty-tab-box-button').click(function (e) {
            self._createNewEmptyBox();
            self._notifyListeners("addBox");
        });
        $('#put-tab-to-new-box-button').click(function (e) {
            self._putCurrentTabToNewBox();
            self._notifyListeners("addBox");
        });
        $('#open-options-button').click(function (e) {
            Tabs.selectOptionsTab();
        });

        $('#search-input').on('input', function (e) {
            self.searchQuery = $(this).val();
            self._filterBoxes();
        });
    }

    _filterBoxes() {
        var self = this;
        this.itemViews.forEach(function (boxView) {
            boxView.filterTabs(self.searchQuery);
        });
    }
}