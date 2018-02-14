$(document).ready(function () {
    Themes.init();
    Themes.applySavedThemeToCurrentPage();

    ModalDialogFactory.initModals($("body"));

    Boxes.loadBoxes(function (boxes) {
        var boxesView = new BoxesView(boxes);
        boxesView.outputView();

        sortable('#boxes', {
            handle: '.box-name',
            forcePlaceholderSize: true,
        });
        sortable('#boxes')[0].addEventListener('sortupdate', function (e) {
            boxes.changeBoxPosition(e.detail.item.id, e.detail.index);
        });

        sortable('.box-content', {
            handle: '.tab-title',
            forcePlaceholderSize: true,
            connectWith: 'tabs-list'
        });
        sortable('.box-content')[0].addEventListener('sortupdate', function (e) {
            if (e.detail.startparent === e.detail.endparent) {
                var boxId = $("#" + e.detail.endparent.id).parent().attr('id');
                var tabId = e.detail.item.id.substr(4);
                boxes.changeTabPosition(boxId, tabId, e.detail.index)
            } else {
                var oldBoxId = $("#" + e.detail.startparent.id).parent().attr('id');
                var newBoxId = $("#" + e.detail.endparent.id).parent().attr('id');
                var tabIdToMove = e.detail.item.id.substr(4);
                boxes.moveTabToBox(oldBoxId, newBoxId, tabIdToMove, e.detail.index)
            }
        });
    });
});