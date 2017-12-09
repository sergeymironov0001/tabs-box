var boxTemplate;

function putTabIntoNewBox(boxes, activeTab) {
    Tabs.getCurrentTabPicture(function (dataUrl) {
        Tabs.createNewTab(function (createdTabsBox) {
                var box = Boxes.createBox(createdTabsBox.id);
                box.tab = Tabs.createTabInfo(activeTab, dataUrl);
                boxes.push(box);
                outputBoxes(boxes);
                Boxes.saveBoxes(boxes);

                Notifications.createTabBoxListener(createdTabsBox.id, function (sendResponse) {
                    sendResponse(box);
                });
            }
        );
    });
}

function putTabIntoExistingBox(tab, boxId) {
    Tabs.getCurrentTabPicture(function (dataUrl) {
        var tabInfo = Tabs.createTabInfo(tab, dataUrl);

        Notifications.sendPutTabInBox(boxId, tabInfo, function (response) {
            // Tabs.closeTab(tab.id);
        });
    });
}

function outputBoxes(boxes) {
    var boxesHtml = $.map(boxes, function (box) {
        return Mustache.to_html(boxTemplate, box);
    });
    $("#boxes").html(boxesHtml.join(""));

    boxes.forEach(function (box, i, arr) {
        $("#boxes")
            .on("click", "#add-to-box-" + box.id, function () {
                Tabs.getCurrentTab(function (tab) {
                    putTabIntoExistingBox(tab, box.id);
                });
            })
            .on("click", "#switch-to-box-" + box.id, function () {
                Tabs.selectTab(box.id);
            })
            .on("click", "#close-box-" + box.id, function () {
                Boxes.closeBox(boxes, box.id);
                outputBoxes(boxes);
                Tabs.closeTab(box.id);
            });
    });
}

$(document).ready(function () {
    Templates.loadPopupBoxTemplate(function (template) {
        boxTemplate = template;
    });

    Boxes.getBoxes(function (boxes) {
        outputBoxes(boxes);

        $('#crete-new-tab-box-button').click(function (e) {
            Tabs.getCurrentTab(function (tab) {
                putTabIntoNewBox(boxes, tab);
            });
        });
    });
});