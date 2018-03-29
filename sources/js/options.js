// TODO refactor it
function fillThemesSelect(themesManager) {
    themesManager.getThemes().forEach(theme => {
        $('#theme-select')
            .append($("<option></option>")
                .attr("value", theme.name)
                .text(theme.name)
            );
    });
}

function selectTheme(themeName) {
    $("#theme-select").val(themeName);
}

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

        $("#themes").append(view.getHtml());
        fillThemesSelect(themesManager);
        selectTheme(themesManager.getSelectedTheme().name);

        view.init();
    });
});