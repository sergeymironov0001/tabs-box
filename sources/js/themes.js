class Theme {
    constructor(name, cssClass) {
        this.name = name;
        this.cssClass = cssClass;
    }

    toString() {
        return `Theme.(${this.name},${this.cssClass})`;
    }

    static getThemes() {
        return [
            Theme.PORNHUB,
            Theme.CHOME
        ];
    }

    static getThemeByName(name) {
        var themes = Theme.getThemes().filter(function (theme) {
            return theme.name === name;
        });
        return themes && themes.length > 0 ? themes[0] : undefined;
    }

    static getDefaultTheme() {
        return Theme.PORNHUB;
    }
}

Theme.PORNHUB = new Theme('PornHub', 'porn-hub');
Theme.CHOME = new Theme('Chrome', 'chrome');

class Themes {
    static changeTheme(themeName) {
        var theme = Theme.getThemeByName(themeName);
        LocalStorageUtils.saveTheme(theme.name);
        NotificationUtils.sendThemeChanged(themeName);
        Themes.selectedTheme = themeName;
        Themes.applyThemeToCurrentPage(themeName);
    }

    static loadTheme(callback) {
        LocalStorageUtils.loadTheme(function (themeName) {
            if (themeName) {
                Themes.selectedTheme = themeName;
            } else {
                Themes.selectedTheme = Theme.getDefaultTheme().name;
            }
            if (callback) {
                callback(Themes.selectedTheme);
            }
        });
    }

    static applySavedThemeToCurrentPage() {
        Themes.applyThemeToCurrentPage(Themes.selectedTheme);
    }

    static applyThemeToCurrentPage(themeName) {
        console.log("Theme: " + themeName);
        Themes.removeThemesFromCurrentPage();
        var theme = Theme.getThemeByName(themeName);
        if (theme) {
            $('body').addClass(theme.cssClass);
        }
    }

    static removeThemesFromCurrentPage() {
        Theme.getThemes().forEach(function (theme) {
            $('body').removeClass(theme.cssClass);
        });
    }

    static init(callback) {
        NotificationUtils.addThemeChangedListener(function (themeName) {
            Themes.applyThemeToCurrentPage(themeName);
        });
        Themes.loadTheme(callback);
    }
}

Themes.init();