function outputTabsInfo(tabsInfo) {
    console.log("Output tabs");
    var newHTML = $.map(tabsInfo, function (tabInfo) {
        console.log(tabInfo);
        return ('<a href="' + tabInfo.url + '" target="_blank" title="' + tabInfo.title + '">' +
            '<div id="' + tabInfo.id + '" class="tab container m-1">' +
            '   <div class="row">' +
            '       <div class="col-2 p-1 m-0 tab-favicon">' +
            '           <img src="' + tabInfo.faviconUrl + '"/>' +
            '       </div>' +
            '       <div class="tab-title col-8 p-1 m-0">' + tabInfo.title + '</div>' +
            '       <div class="col-2 p-1 m-0 tab-close">' +
            '           <button id="close-' + tabInfo.id + '" type="button" class="close tab-close-button" aria-label="Close">' +
            '               &times;' +
            '           </button>' +
            '       </div>' +
            '   </div>' +
            '   <div class="row">' +
            '       <div>' +
            '           <img id="thumb-' + tabInfo.tab.id + '" src="' + tabInfo.thumbImgUrl + '"/>' +
            '       </div>' +
            '   </div>' +
            '</div>' +
            '</a>');
    });
    $("#box").html(newHTML.join(""));
    tabsInfo.forEach(function (tabInfo, i, arr) {
        console.log(tabInfo.id);
        $("#close-" + tabInfo.id).click(function (e) {
            e.preventDefault();
            $("#" + tabInfo.id).remove();
            box.deleteTab(tabsInfo, tabInfo.id);
        });
    });
}

$(document).ready(function () {
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
        outputTabsInfo(box.getTabs());

        Notifications.addPutTabInBoxListener(box.id, function (tab) {
            box.putTabInBox(tab);
            outputTabsInfo(box.getTabs());
        });
    });
});


