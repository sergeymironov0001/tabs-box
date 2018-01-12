var boxTemplate;
var changeBoxPositionFunc;

function createNewEmptyBox(boxes) {
    var box = boxes.addNewBox();
    outputBoxes(boxes);
    addBoxButtonsEventListeners(boxes, box);
    Tabs.selectBoxTab(box.id);
}

function putTabToNewBox(boxes, activeTab) {
    var box = boxes.addNewBox();
    outputBoxes(boxes);
    addBoxButtonsEventListeners(boxes, box);

    Tabs.getCurrentTabPicture(function (dataUrl) {
        var tabInfo = new Tab(null, activeTab, dataUrl);
        boxes.putTabToBox(box.id, tabInfo);
        Tabs.selectBoxTab(box.id);
    });
}

function putTabToExistingBox(boxes, boxId, tab, callback) {
    Tabs.getCurrentTabPicture(function (dataUrl) {
        var tabInfo = new Tab(null, tab, dataUrl);
        boxes.putTabToBox(boxId, tabInfo);
        if (callback) {
            callback(tabInfo.id);
        }
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

    $('#boxes')
        .sortable({
            placeholderClass: 'box'
        })
        .bind('sortupdate', changeBoxPositionFunc);

    boxes.getBoxes().forEach(function (box) {
        if (box.showContent) {
            // $("#box-content-" + box.id).collapse('show');
            $("#box-content-" + box.id).addClass('show');
        }
    });
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
                putTabToExistingBox(boxes, box.id, tab, function (tabId) {
                    outputBoxes(boxes);
                    addTabListeners(boxes, box.id, tabId);
                });
            });
        })
        .on("click", "#switch-to-box-" + box.id, function () {
            Tabs.selectBoxTab(box.id);
        })
        .on("click", "#close-box-" + box.id, function () {
            boxes.removeBox(box);
            outputBoxes(boxes);
            Tabs.closeBoxTab(box.id);
        });

    box.tabs.forEach(function (tab) {
        addTabListeners(boxes, box.id, tab.id);
    });

    $("#box-content-" + box.id)
        .on("show.bs.collapse", function () {
            boxes.showBoxContent(box.id);
        })
        .on("hide.bs.collapse", function () {
            boxes.hideBoxContent(box.id);
        });

    $("#rename-box-" + box.id)
        .on("click", function () {
            $("#switch-to-box-" + box.id)
                .attr("hidden", "");

            var boxNameInput = $("#box-name-input-" + box.id);
            boxNameInput.removeAttr("hidden").focus();

            var nameLength = boxNameInput.val().length;
            boxNameInput.focus();
            boxNameInput[0].setSelectionRange(nameLength, nameLength)
        });

    $("#box-name-input-" + box.id)
        .on("focusout", function () {
            var name = $(this).val();

            boxes.changeBoxName(box.id, name);

            $(this).attr("hidden", "");
            $("#switch-to-box-" + box.id)
                .text(name)
                .removeAttr("hidden");
        });
}

function addTabListeners(boxes, boxId, tabId) {
    $("#boxes")
        .on("click", "#remove-tab-" + tabId, function () {
            boxes.removeTabFromBox(boxId, tabId, function () {
                outputBoxes(boxes);
            });
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