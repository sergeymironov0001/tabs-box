function fillThemesSelect() {
    Theme.getThemes().forEach(function (theme) {
        $('#theme-select')
            .append($("<option></option>")
                .attr("value", theme.name)
                .text(theme.name)
            );
    });
}

function getSelectedTheme() {
    return $("#theme-select option:selected").val();
}

function selectTheme(themeName) {
    console.log(themeName);
    $("#theme-select").val(themeName);
}

$(document).ready(function () {
    Themes.init(function (themeName) {
        Themes.applySavedThemeToCurrentPage();

        fillThemesSelect();
        $('#theme-select').change(function () {
            console.log("Change theme:" + getSelectedTheme());
            Themes.changeTheme(getSelectedTheme());
        });
        selectTheme(themeName);
    });
});

