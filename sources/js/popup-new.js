$(document).ready(function () {
    Themes.init();
    Themes.applySavedThemeToCurrentPage();

    ModalDialogFactory.initModals($("#boxes"));

    BoxesManager.loadBoxes(function (boxesManager) {

        Observable.addGlobalListener((event, className) => {
            console.log(event);
            console.log("class = " + className);
            BoxesManager.saveBoxes(boxesManager, () =>
                console.log("Boxes saved"));
        }, ["Tab", "Box", "BoxesManager"]);

        let mvcResolver = new MVCResolver();
        let view = mvcResolver.createView(boxesManager);

        $("#boxes").append(view.getHtml());

        view.init();
    });
});