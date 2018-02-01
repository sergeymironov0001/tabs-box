class BoxView extends View {

    constructor(boxes, box) {
        super();
        this.boxes = boxes;
        this.box = box;

        var self = this;
        this.subViewEventListener = function (tabView, type) {
            if (type === 'delete') {
                self.__deleteSubView(tabView);
                self.boxes.removeTabFromBox(self.box.id, tabView.tab.id);
            }
        };
        this.tabViews = this.__createSubViews(box.getTabs());

        this.tabViews.forEach(function (view) {
            view.addEventsListener(self.subViewEventListener);
        });
    }

    getElement() {
        return $("#" + this.box.id);
    }

    expand() {
        this.boxes.showBoxContent(this.box.id);
        $("#box-content-" + this.box.id).addClass('show');
        $("#collapse-box-icon-" + this.box.id).removeClass("fa-toggle-down").addClass("fa-toggle-up");
    }

    collapse() {
        this.boxes.hideBoxContent(this.box.id);
        // $("#box-content-" + this.box.id).removeClass('show');
        $("#collapse-box-icon-" + this.box.id).removeClass("fa-toggle-up").addClass("fa-toggle-down");
    }

    __getSubViews() {
        return this.tabViews;
    }

    __createSubView(tab) {
        return new TabView(this.box, tab);
    }

    __outputSubView(tabView) {
        tabView.outputView($('#box-content-' + this.box.id));
    }

    __generateElement() {
        return Mustache.to_html(BoxView.elementTemplate, this.box);
    }

    __addCurrentTab() {
        var self = this;
        Tabs.getCurrentTab(function (tabInfo) {
            Tabs.getCurrentTabPicture(function (pictureUrl) {
                var tab = new Tab(null, tabInfo, pictureUrl);
                if (self.boxes.putTabToBox(self.box.id, tab)) {
                    var tabView = self.__createSubView(tab);
                    self.__addSubView(tabView);
                    self.__outputSubView(tabView);
                }
            });
        });
    }

    __addButtonsListeners() {
        var self = this;
        $("#boxes")
            .on("click", "#add-to-box-button-" + this.box.id, function () {
                self.__addCurrentTab();
                self.__notifyListeners("addTab");
            })
            .on("click", "#switch-to-box-" + this.box.id, function () {
                Tabs.selectBoxTab(self.box.id);
                self.__notifyListeners("select");
            })
            .on("click", "#rename-box-button-" + this.box.id, function () {
                self.__notifyListeners("edit");
            })
            .on("click", "#remove-box-button-" + this.box.id, function () {
                Tabs.closeBoxTab(self.box.id);
                self.deleteElement();
                self.__notifyListeners("delete");
            });

        $("#box-content-" + this.box.id)
            .on("show.bs.collapse", function () {
                self.expand();
            })
            .on("hide.bs.collapse", function () {
                self.collapse();
            });
    }
}

Templates.loadPopupBoxTemplate(function (template) {
    BoxView.elementTemplate = template;
});
