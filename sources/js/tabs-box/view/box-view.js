class BoxView extends ListView {

    constructor(boxes, box) {
        super(box, box.getTabs());
        this.boxes = boxes;
    }

    _getItemViewsEventListener() {
        var self = this;
        return function (tabView, type) {
            switch (type) {
                case 'delete': {
                    self._deleteItemView(tabView);
                    self.boxes.removeTabFromBox(self.getData().id, tabView.getData().id);
                    break;
                }
                case 'edit': {
                    self.boxes.changeTabTitleAndUrl(self.getData().id, tabView.getData().id,
                        tabView.getData().title, tabView.getData().url);
                    break;
                }
            }
        }
    }

    getElement() {
        return $("#" + this.getData().id);
    }

    expand() {
        this.boxes.showBoxContent(this.getData().id);
        $("#box-content-" + this.getData().id).addClass('show');
        $("#collapse-box-icon-" + this.getData().id).removeClass("fa-toggle-down").addClass("fa-toggle-up");
    }

    collapse() {
        this.boxes.hideBoxContent(this.getData().id);
        // $("#box-content-" + this.box.id).removeClass('show');
        $("#collapse-box-icon-" + this.getData().id).removeClass("fa-toggle-up").addClass("fa-toggle-down");
    }


    _createItemView(tab) {
        return new TabView(this.getData(), tab);
    }

    _getParentElementForItemViews() {
        return $('#box-content-' + this.getData().id);
    }

    _generateElement() {
        return Mustache.to_html(BoxView.elementTemplate, this.getData());
    }

    _addCurrentTab(callback) {
        var self = this;
        Tabs.getCurrentTab(function (tabInfo) {
            Tabs.getCurrentTabPicture(function (pictureUrl) {
                var tab = new Tab(null, tabInfo, pictureUrl);
                if (self.boxes.putTabToBox(self.getData().id, tab)) {
                    self._createAddAndOutputItemView(tab);
                    if (callback) callback();
                }
            });
        });
    }

    _updateName() {
        $("#switch-to-box-" + this.getData().id).text(this.getData().name)
    }

    _addButtonsListeners() {
        var self = this;
        $("#boxes")
            .on("click", "#add-to-box-button-" + this.getData().id, function () {
                self._addCurrentTab(function () {
                    self._notifyListeners("addTab");
                });
            })
            .on("click", "#switch-to-box-" + this.getData().id, function () {
                Tabs.selectBoxTab(self.getData().id);
                self._notifyListeners("select");
            })
            .on("click", "#rename-box-button-" + this.getData().id, function () {
                ModalDialogFactory.createDialog('editBox', self.getData(), function (box) {
                    self.data = box;
                    self._updateName();
                    self._notifyListeners("edit");
                }).show();
            })
            .on("click", "#remove-box-button-" + this.getData().id, function () {
                Tabs.closeBoxTab(self.getData().id);
                self.deleteElement();
                self._notifyListeners("delete");
            });

        $("#box-content-" + this.getData().id)
            .on("show.bs.collapse", function () {
                self.expand();
            })
            .on("hide.bs.collapse", function () {
                self.collapse();
            });
    }

    // TODO refactor this nightmare
    filterTabs(searchQuery) {
        if (!searchQuery || searchQuery.length === 0) {
            this.show();
            this._showItemViews();
            if (!this.getData().showContent) {

                $("#box-content-" + this.getData().id).removeClass('show');
                $("#collapse-box-icon-" + this.getData().id).removeClass("fa-toggle-up").addClass("fa-toggle-down");
            }
            return;
        }

        var tabs = this.getData().searchTabs(searchQuery);
        if (tabs.length === 0) {
            this.hide();
            return;
        }
        this._hideItemViews();
        this.show();

        $("#box-content-" + this.getData().id).addClass('show');
        $("#collapse-box-icon-" + this.getData().id).removeClass("fa-toggle-down").addClass("fa-toggle-up");

        var itemsToShow = this._getItemViews(tabs);
        this._showItemViews(itemsToShow);
    }
}

Templates.loadPopupBoxTemplate(function (template) {
    BoxView.elementTemplate = template;
});
