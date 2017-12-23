var tabSnapshotTemplate;

function getUrlParam(name) {
    if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
}

function outputTabsInfo(box) {
    console.log(box);
    var tabsInfoHtml = $.map(box.tabs, function (tab) {
        return Mustache.to_html(tabSnapshotTemplate, tab);
    });
    $("#box").html(tabsInfoHtml.join(""));
}

function addTabEventListeners(boxes, box) {
    box.tabs.forEach(function (tab) {
        addTabEventListener(boxes, box, tab);
    });
}

function addTabEventListener(boxes, box, tab) {
    $("#box")
        .on("click", "#close-" + tab.id, function (e) {
            console.log("Delete tab");
            e.preventDefault();
            $("#" + tab.id).remove();
            boxes.removeTabFromBox(box.id, tab);
        });
}

$(document).ready(function () {
    Templates.loadTabSnapshotTemplate(function (template) {
        tabSnapshotTemplate = template;
    });

    Boxes.loadBoxes(function (boxes) {
        var boxId = getUrlParam("boxId");
        var box = boxes.getBoxById(boxId);

        $('#tabs-box-name-input').focusout(function () {
            console.log("Change name");
            var name = $(this).val();
            boxes.changeBoxName(boxId, name);
            Tabs.changeTabTitle(box.name);
        }).val(box.name);

        Tabs.changeTabTitle(box.name);
        outputTabsInfo(box);
        addTabEventListeners(boxes, box);

        Notifications.addPutTabToBoxListener(box.id, function (tab) {
            outputTabsInfo(box);
            addTabEventListener(boxes, box, tab);
        });
    });
});


