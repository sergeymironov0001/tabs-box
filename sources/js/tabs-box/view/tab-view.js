class TabView extends View {

    constructor(model) {
        super(model);

        this.tabTitleElementId = "#tab-title-" + this.id;
        this.editTabButtonElementId = "#edit-tab-" + this.id;
        this.removeTabButtonElementId = "#remove-tab-" + this.id;
    }

    getHtml() {
        return HtmlTemplateUtils.generateTabHtml(this.model);
    }

    getElement() {
        return $("#tab-" + this.id);
    }

    init() {
        this.model.addListener(event => this._updateView(event));

        this._addSelectTabAction();
        this._addEditTabAction();
        this._addRemoveTabAction();
    }

    _updateView(event) {
        switch (event.type) {
            case "titleChanged":
                $(this.tabTitleElementId).text(this.model.title);
                break;
        }
    }

    _addSelectTabAction() {
        $("#boxes").on("click", this.tabTitleElementId, () =>
            this._notifyListeners("tabView/selectTabAction"));
    }

    _addEditTabAction() {
        $("#boxes").on("click", this.editTabButtonElementId, () =>
            this._notifyListeners("tabView/editTabAction"));
    }

    _addRemoveTabAction() {
        $("#boxes").on("click", this.removeTabButtonElementId, () =>
            this._notifyListeners("tabView/removeTabAction")
        );
    }
}