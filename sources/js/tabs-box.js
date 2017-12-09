var tabSnapshotTemplate;

function outputTabsInfo(box) {
    var tabsInfoHtml = $.map(box.getTabs(), function (tab) {
        return Mustache.to_html(tabSnapshotTemplate, tab);
    });
    $("#box").html(tabsInfoHtml.join(""));

    box.getTabs().forEach(function (tab, i, arr) {
        $("#box")
            .on("click", "#close-" + tab.id, function (e) {
                console.log("Delete tab " + tab.id);
                e.preventDefault();
                $("#" + tab.id).remove();
                box.deleteTab(tab);
            });
    });
}

$(document).ready(function () {
    Templates.loadTabSnapshotTemplate(function (template) {
        tabSnapshotTemplate = template;
    });

    var box = new Box();
    Tabs.changeTabTitle(box.name);

    $('#tabs-box-name-input').focusout(function () {
        box.name = $(this).val();
        Notifications.sendBoxNameChanged(box);
        Tabs.changeTabTitle(box.name);
    }).val(box.name);

    // Send notification to popup what new box was created
    Notifications.notifyBoxWasCreated(function (boxId, boxName, tab) {
        box.id = boxId;
        box.name = boxName;
        box.putTabInBox(tab);

        Tabs.changeTabTitle(box.name);
        outputTabsInfo(box);

        Notifications.addPutTabInBoxListener(box.id, function (tab) {
            box.putTabInBox(tab);
            outputTabsInfo(box);
        });
    });
});


