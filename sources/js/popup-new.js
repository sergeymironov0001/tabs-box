$(document).ready(function () {
    let themesManager;
    ThemesManager.loadTheme(themeName => {
        let themesManager = new ThemesManager(themeName);
        themesManager.addListener(event => {
            if (event.type === "themeChanged") {
                ThemesManager.saveTheme(event.data.name);
            }
        });
    });

    ModalDialogFactory.initModals($("#boxes"));

    BoxesManager.loadBoxes(boxesManager => {
        Observable.addGlobalListener((event, className) => {
            // console.log(event);
            // console.log("class = " + className);
            BoxesManager.saveBoxes(boxesManager, () =>{
                // console.log("Boxes saved");
            });
        }, ["Tab", "Box", "BoxesManager"]);

        let mvcResolver = new MVCResolver();
        let view = mvcResolver.createView(boxesManager);

        $("#boxes").append(view.getHtml());

        view.init();
    });
});