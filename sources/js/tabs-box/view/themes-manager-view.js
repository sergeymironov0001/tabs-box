class ThemesManagerView extends View {

    constructor(model) {
        super(model);
    }

    init() {
        this.model.addListener(event => this._updateView(event));

        this._outputAvailableThemes();
        this._selectTheme(this.model.getSelectedTheme().name);
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
        $('#theme-selector').change(() => {
            let selectedThemeName = $("#theme-selector option:selected").val();
            this._notifyListeners("themesManagerView/themeChangedAction",
                selectedThemeName)
        });
    }

    _outputAvailableThemes() {
        this.model.getThemes().forEach(theme => {
            $('#theme-selector')
                .append($("<option></option>")
                    .attr("value", theme.name)
                    .text(theme.name)
                );
        });
    }
    _selectTheme(themeName) {
        $("#theme-select").val(themeName);
    }
}