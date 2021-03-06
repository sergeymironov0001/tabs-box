$(document).ready(function () {
    ThemesManager.loadTheme(themeName => {
        let themesManager = new ThemesManager(themeName);
        themesManager.addListener(event => {
            if (event.type === "themeChanged") {
                ThemesManager.saveTheme(event.data.name);
            }
        });
    });

    ModalDialogFactory.initModals($("body"));

    BoxesManager.loadBoxes(boxesManager => {
        Observable.addGlobalListener((event, className) => {
            BoxesManager.saveBoxes(boxesManager, () => {
            });
        }, ["Tab", "Box", "BoxesManager"]);

        let mvcResolver = new MVCResolver();
        let view = mvcResolver.createView(boxesManager);

        $("#boxes").append(view.getHtml());
        view.init();
    });
});