class ThemesManagerView extends View {

    constructor(model) {
        super(model);
    }

    init() {
        this.model.addListener(event => this._updateView(event));

        this._addChangeThemeAction();
    }

    getHtml() {
        return HtmlTemplateUtils.generateThemesHtml(this.model);
    }

    _updateView(event) {
        switch (event.type) {
            case "themeChanged":
                break;
        }
    }

    _addChangeThemeAction() {
        $('#theme-select').change(() => {
            let selectedThemeName = $("#theme-select option:selected").val();
            this._notifyListeners("themesManagerView/themeChangedAction",
                selectedThemeName)
        });
    }
}