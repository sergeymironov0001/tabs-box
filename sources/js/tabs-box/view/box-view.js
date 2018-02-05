class BoxView extends ListView {

    constructor(boxes, box) {
        super(box, box.getTabs());
        this.boxes = boxes;
    }

    __getItemViewsEventListener() {
        var self = this;
        return function (tabView, type) {
            if (type === 'delete') {
                self.__deleteItemView(tabView);
                self.boxes.removeTabFromBox(self.getData().id, tabView.getData().id);
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


    __createItemView(tab) {
        return new TabView(this.getData(), tab);
    }

    __getParentElementForItemViews() {
        return $('#box-content-' + this.getData().id);
    }

    __generateElement() {
        return Mustache.to_html(BoxView.elementTemplate, this.getData());
    }

    __addCurrentTab() {
        var self = this;
        Tabs.getCurrentTab(function (tabInfo) {
            Tabs.getCurrentTabPicture(function (pictureUrl) {
                var tab = new Tab(null, tabInfo, pictureUrl);
                if (self.boxes.putTabToBox(self.getData().id, tab)) {
                    self.__createAddAndOutputItemView(tab);
                }
            });
        });
    }

    __addButtonsListeners() {
        var self = this;
        $("#boxes")
            .on("click", "#add-to-box-button-" + this.getData().id, function () {
                self.__addCurrentTab();
                self.__notifyListeners("addTab");
            })
            .on("click", "#switch-to-box-" + this.getData().id, function () {
                Tabs.selectBoxTab(self.getData().id);
                self.__notifyListeners("select");
            })
            .on("click", "#rename-box-button-" + this.getData().id, function () {
                self.__notifyListeners("edit");
            })
            .on("click", "#remove-box-button-" + this.getData().id, function () {
                Tabs.closeBoxTab(self.getData().id);
                self.deleteElement();
                self.__notifyListeners("delete");
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
            this.__showItemViews();
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
        this.__hideItemViews();
        this.show();

        $("#box-content-" + this.getData().id).addClass('show');
        $("#collapse-box-icon-" + this.getData().id).removeClass("fa-toggle-down").addClass("fa-toggle-up");

        var itemsToShow = this.__getItemViews(tabs);
        this.__showItemViews(itemsToShow);
    }
}

Templates.loadPopupBoxTemplate(function (template) {
    BoxView.elementTemplate = template;
});
