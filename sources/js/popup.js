var boxTemplate;

function selectBoxTab(boxId) {
    Tabs.getBoxTab(boxId, function (tab) {
        if (tab) {
            Tabs.selectTab(tab.id);
        } else {
            Tabs.createBoxTab(boxId, function (newTab) {
                // Tabs.selectTab(newTab.id);
            });
        }
    });
}

function putTabToNewBox(boxes, activeTab) {
    var box = boxes.addNewBox();

    Tabs.getCurrentTabPicture(function (dataUrl) {
        var tabInfo = Tabs.createTabInfo(activeTab, dataUrl);
        boxes.putTabToBox(box.id, tabInfo);
        selectBoxTab(box.id);
        outputBoxes(boxes);
    });
}

function putTabToExistingBox(boxes, boxId, tab) {
    Tabs.getCurrentTabPicture(function (dataUrl) {
        var tabInfo = Tabs.createTabInfo(tab, dataUrl);
        boxes.putTabToBox(boxId, tabInfo);
        // selectBoxTab(boxId);
        // Tabs.closeTab(tab.id);
    });
}

function outputBoxes(boxes) {
    console.log("Output boxes");
    console.log(boxes.getBoxes());
    var boxesHtml = $.map(boxes.getBoxes(), function (box) {
        console.log("Output box");
        console.log(box);
        return Mustache.to_html(boxTemplate, box);
    });
    $("#boxes").html(boxesHtml.join(""));

    boxes.getBoxes().forEach(function (box, i, arr) {
        $("#boxes")
            .on("click", "#add-to-box-" + box.id, function () {
                Tabs.getCurrentTab(function (tab) {
                    putTabToExistingBox(boxes, box.id, tab);
                });
            })
            .on("click", "#switch-to-box-" + box.id, function () {
                selectBoxTab(box.id);
            })
            .on("click", "#close-box-" + box.id, function () {
                console.log("close box " + box.id)
                boxes.removeBox(box);
                outputBoxes(boxes);
                Tabs.closeBoxTab(box.id);
            });
    });
}

$(document).ready(function () {
    Templates.loadPopupBoxTemplate(function (template) {
        boxTemplate = template;

        Boxes.loadBoxes(function (boxes) {
            outputBoxes(boxes);

            $('#crete-new-tab-box-button').click(function (e) {
                Tabs.getCurrentTab(function (tab) {
                    putTabToNewBox(boxes, tab);
                });
            });
        });
    });
});