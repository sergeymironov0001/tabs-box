$(document).ready(function () {
    Themes.init();
    Themes.applySavedThemeToCurrentPage();

    ModalDialogFactory.initModals($("body"));

    Boxes.loadBoxes(function (boxes) {
        var boxesView = new BoxesView(boxes);
        boxesView.outputView();
    });
});