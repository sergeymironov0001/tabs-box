class TabView extends View {

    constructor(box, tab) {
        super(tab);
    }

    getElement() {
        return $('#tab-' + this.getData().id);
    }

    __generateElement() {
        return Mustache.to_html(TabView.elementTemplate, this.getData());
    }

    __addButtonsListeners() {
        var self = this;
        $("#boxes")
            .on("click", "#tab-title-" + this.getData().id, function () {
                Tabs.selectTabByUrl(self.getData().url);
                self.__notifyListeners("select");
            })
            .on("click", "#edit-tab-" + this.getData().id, function () {
                self.__notifyListeners("edit");
            })
            .on("click", "#remove-tab-" + this.getData().id, function () {
                self.deleteElement();
                self.__notifyListeners("delete");
            });
    }
}

Templates.loadPopupTabTemplate(function (template) {
    TabView.elementTemplate = template;
});
