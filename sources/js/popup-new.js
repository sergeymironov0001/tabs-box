var boxesViews;

$(document).ready(function () {
    Themes.init();
    Themes.applySavedThemeToCurrentPage();

    Boxes.loadBoxes(function (boxes) {
        boxesViews = new BoxesView(boxes);
        boxesViews.outputView();
    });
});