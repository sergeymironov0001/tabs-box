var boxTemplate;
var changeBoxPositionFunc;

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

function createNewEmptyBox(boxes) {
    var box = boxes.addNewBox();
    outputBoxes(boxes);
    addBoxButtonsEventListeners(boxes, box);
    selectBoxTab(box.id);
}

function putTabToNewBox(boxes, activeTab) {
    var box = boxes.addNewBox();
    outputBoxes(boxes);
    addBoxButtonsEventListeners(boxes, box);

    Tabs.getCurrentTabPicture(function (dataUrl) {
        var tabInfo = Tabs.createTabInfo(activeTab, dataUrl);
        boxes.putTabToBox(box.id, tabInfo);
        selectBoxTab(box.id);
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
    var boxesHtml = $.map(boxes.getBoxes(), function (box) {
        return Mustache.to_html(boxTemplate, box);
    });
    $('#boxes').html(boxesHtml.join(""));

    if (!changeBoxPositionFunc) {
        changeBoxPositionFunc = function (e, ui) {
            boxes.changeBoxPosition(ui.item[0].id, ui.item.index());
        }
    } else {
        $('#boxes').unbind('sortupdate', changeBoxPositionFunc);
    }

    $('#boxes').sortable({
        placeholderClass: 'box'
    }).bind('sortupdate', changeBoxPositionFunc);
}

function addButtonsEventListeners(boxes) {
    boxes.getBoxes().forEach(function (box) {
        addBoxButtonsEventListeners(boxes, box);
    });
}

function addBoxButtonsEventListeners(boxes, box) {
    console.log("Box buttons event listener " + box.id);
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
            boxes.removeBox(box);
            outputBoxes(boxes);
            Tabs.closeBoxTab(box.id);
        });
}

$(document).ready(function () {
    Templates.loadPopupBoxTemplate(function (template) {
        boxTemplate = template;

        Boxes.loadBoxes(function (boxes) {
            outputBoxes(boxes);
            addButtonsEventListeners(boxes);

            $('#crete-empty-tab-box-button').click(function (e) {
                createNewEmptyBox(boxes);
            });
            $('#put-tab-to-new-box-button').click(function (e) {
                Tabs.getCurrentTab(function (tab) {
                    putTabToNewBox(boxes, tab);
                });
            });
        });
    });
});