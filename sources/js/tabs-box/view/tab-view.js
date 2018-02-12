class TabView extends View {

    constructor(box, tab) {
        super(tab);
    }

    getElement() {
        return $('#tab-' + this.getData().id);
    }

    _generateElement() {
        return Mustache.to_html(TabView.elementTemplate, this.getData());
    }

    _updateTitle() {
        $("#tab-title-" + this.getData().id).text(this.getData().title);
    }

    _addButtonsListeners() {
        var self = this;
        $("#boxes")
            .on("click", "#tab-title-" + this.getData().id, function () {
                Tabs.selectTabByUrl(self.getData().url);
                self._notifyListeners("select");
            })
            .on("click", "#edit-tab-" + this.getData().id, function () {
                ModalDialogFactory.createDialog('editTab', self.getData(), function (tab) {
                    self.data = tab;
                    self._updateTitle();
                    self._notifyListeners("edit");
                }).show();
            })
            .on("click", "#remove-tab-" + this.getData().id, function () {
                self.deleteElement();
                self._notifyListeners("delete");
            });
    }
}

Templates.loadPopupTabTemplate(function (template) {
    TabView.elementTemplate = template;
});
