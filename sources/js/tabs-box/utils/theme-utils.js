class ThemeUtils {

    static applyThemeToCurrentPage(theme) {
        if (theme) {
            $('body').addClass(theme.cssClass);
        }
    }

    static removeThemesFromCurrentPage(themes) {
        themes.forEach(theme => $('body').removeClass(theme.cssClass));
    }
}