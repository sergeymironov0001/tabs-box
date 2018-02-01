class TabView extends View {

    constructor(box, tab) {
        super();
        this.box = box;
        this.tab = tab;
    }

    getElement() {
        return $('#tab-' + this.tab.id);
    }

    __generateElement() {
        return Mustache.to_html(TabView.elementTemplate, this.tab);
    }

    __addButtonsListeners() {
        var self = this;
        $("#boxes")
            .on("click", "#tab-title-" + this.tab.id, function () {
                Tabs.selectTabByUrl(self.tab.url);
                self.__notifyListeners("select");
            })
            .on("click", "#edit-tab-" + this.tab.id, function () {
                self.__notifyListeners("edit");
            })
            .on("click", "#remove-tab-" + this.tab.id, function () {
                self.deleteElement();
                self.__notifyListeners("delete");
            });
    }
}

Templates.loadPopupTabTemplate(function (template) {
    TabView.elementTemplate = template;
});
