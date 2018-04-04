$(document).ready(function () {
    ThemesManager.loadTheme(themeName => {
        let themesManager = new ThemesManager(themeName);
        themesManager.addListener(event => {
            if (event.type === "themeChanged") {
                ThemesManager.saveTheme(event.data.name);
            }
        });

        let mvcResolver = new MVCResolver();
        let view = mvcResolver.createView(themesManager);

        $("#theme-selector").append(view.getHtml());
        view.init();
    });
});