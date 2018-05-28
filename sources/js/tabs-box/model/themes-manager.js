class ThemesManager extends Observable {

    constructor(themeName) {
        super();
        let theme = ThemesManager._getThemeByName(themeName);
        theme = theme || this.getDefaultTheme();
        this.selectedTheme = theme;
        ThemeUtils.removeThemesFromCurrentPage(this.getThemes())
        ThemeUtils.applyThemeToCurrentPage(theme);
    }

    getSelectedTheme() {
        return this.selectedTheme;
    }

    getThemes() {
        return ThemesManager.themes;
    }

    getDefaultTheme() {
        return ThemesManager.themes[0];
    }

    applyTheme(themeName) {
        let theme = ThemesManager._getThemeByName(themeName);
        if (theme) {
            this.selectedTheme = theme;
            ThemeUtils.removeThemesFromCurrentPage(this.getThemes())
            ThemeUtils.applyThemeToCurrentPage(theme);
            this._notifyListeners("themeChanged", theme);
        }
    }

    static _getThemeByName(name) {
        let themes = ThemesManager.themes.filter(theme => theme.name === name);
        return themes && themes.length > 0 ? themes[0] : undefined;
    }

    static saveTheme(themeName, callback) {
        LocalStorageUtils.saveTheme(themeName, callback);
    }

    static loadTheme(callback) {
        LocalStorageUtils.loadTheme(callback);
    }
}

ThemesManager.themes = [
    new Theme('Chrome', 'chrome'),
    new Theme('PornHub', 'porn-hub')
];
