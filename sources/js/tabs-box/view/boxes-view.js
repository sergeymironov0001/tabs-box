class BoxesView extends ListView {

    constructor(boxes) {
        super(boxes, boxes.getBoxes());
    }

    __getItemViewsEventListener() {
        var self = this;
        return function (boxView, type) {
            if (type === 'delete') {
                self.__deleteItemView(boxView);
                self.getData().removeBox(boxView.getData());
            }
        }
    }

    __createItemView(box) {
        return new BoxView(this.getData(), box);
    }

    __getParentElementForItemViews() {
        return $('#boxes');
    }

    __outputItemView(boxView) {
        console.log(boxView);
        boxView.outputView(this.__getParentElementForItemViews());
        if (boxView.getData().showContent) {
            boxView.expand();
        }
    }

    __createNewEmptyBox() {
        var box = this.getData().addNewBox();
        var boxView = this.__createItemView(box);
        this.__addItemView(boxView);
        this.__outputItemView(boxView);
    }

    __putCurrentTabToNewBox() {
        var self = this;
        var box = this.getData().addNewBox();
        Tabs.getCurrentTab(function (activeTab) {
            Tabs.getCurrentTabPicture(function (snapshotImageUrl) {
                var tab = new Tab(null, activeTab, snapshotImageUrl);
                if (!self.getData().putTabToBox(box.id, tab)) {
                    return;
                }
                self.getData().showBoxContent(box.id);
                self.__createAddAndOutputItemView(box);
            });
        });
    }

    __addButtonsListeners() {
        var self = this;
        $('#crete-empty-tab-box-button').click(function (e) {
            self.__createNewEmptyBox();
        });
        $('#put-tab-to-new-box-button').click(function (e) {
            self.__putCurrentTabToNewBox();
        });
        $('#open-options-button').click(function (e) {
            Tabs.selectOptionsTab();
        });

        $('#search-input').on('input', function (e) {
            self.searchQuery = $(this).val();
            self.__filterBoxes();
        });
    }

    __filterBoxes() {
        var self = this;
        this.itemViews.forEach(function (boxView) {
            boxView.filterTabs(self.searchQuery);
        });
    }
}