var boxTemplate;
var changeBoxPositionFunc;
var searchQuery;

function createNewEmptyBox(boxes) {
    var box = boxes.addNewBox();
    outputBoxes($('#search-input').val(), boxes);
    addBoxButtonsEventListeners(boxes, box);
    // Tabs.selectBoxTab(box.id);
}

function putTabToNewBox(boxes, activeTab) {
    var box = boxes.addNewBox();
    outputBoxes($('#search-input').val(), boxes);
    addBoxButtonsEventListeners(boxes, box);

    Tabs.getCurrentTabPicture(function (dataUrl) {
        var tabInfo = new Tab(null, activeTab, dataUrl);
        boxes.putTabToBox(box.id, tabInfo);
        // Tabs.selectBoxTab(box.id);
    });
}

function putTabToExistingBox(boxes, boxId, tab, callback) {
    Tabs.getCurrentTabPicture(function (dataUrl) {
        var tabInfo = new Tab(null, tab, dataUrl);
        boxes.putTabToBox(boxId, tabInfo);
        if (callback) {
            callback(tabInfo);
        }
        // selectBoxTab(boxId);
        // Tabs.closeTab(tab.id);
    });
}

function outputBoxes(searchQuery, boxes) {
    var outputBoxes = boxes.getBoxes();
    if (searchQuery) {
        // outputBoxes = boxes.searchBoxesByName(searchQuery);
        outputBoxes = boxes.searchBoxesByTabs(searchQuery);
        // outputBoxes = boxes.searchBoxesByNameAndTabs(searchQuery);
    }

    var boxesHtml = $.map(outputBoxes, function (box) {
        var originTabs = box.getTabs();
        if (searchQuery) {
            box.tabs = box.searchTabs(searchQuery);
        }
        var boxHtml = Mustache.to_html(boxTemplate, box);
        box.tabs = originTabs;
        return boxHtml;
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

    outputBoxes.forEach(function (box) {
        if (box.showContent || searchQuery) {
            $("#box-content-" + box.id).addClass('show');
            $("#collapse-box-icon-" + box.id).toggleClass("fa-toggle-down fa-toggle-up");
        }
    });
}

function addButtonsEventListeners(boxes) {
    boxes.getBoxes().forEach(function (box) {
        addBoxButtonsEventListeners(boxes, box);
    });
}

function addBoxButtonsEventListeners(boxes, box) {
    $("#boxes")
        .on("click", "#add-to-box-button-" + box.id, function () {
            Tabs.getCurrentTab(function (tab) {
                putTabToExistingBox(boxes, box.id, tab, function (tabInfo) {
                    outputBoxes($('#search-input').val(), boxes);
                    addTabListeners(boxes, box.id, tabInfo);
                });
            });
        })
        .on("click", "#switch-to-box-" + box.id, function () {
            Tabs.selectBoxTab(box.id);
        })
        .on("click", "#remove-box-button-" + box.id, function () {
            boxes.removeBox(box);
            outputBoxes($('#search-input').val(), boxes);
            Tabs.closeBoxTab(box.id);
        })
        .on("click", "#rename-box-button-" + box.id, function () {
            var switchToBoxElement = $("#switch-to-box-" + box.id);
            var hiddenAttr = switchToBoxElement.attr("hidden");
            var hasHiddenAttr = typeof hiddenAttr !== typeof undefined && hiddenAttr !== false;
            if (!hasHiddenAttr) {
                switchToBoxElement.attr("hidden", "hidden");

                var boxNameInput = $("#box-name-input-" + box.id);
                boxNameInput.removeAttr("hidden").focus();

                var nameLength = boxNameInput.val().length;
                boxNameInput.focus();
                boxNameInput[0].setSelectionRange(nameLength, nameLength);
            } else {

            }
        });

    box.tabs.forEach(function (tab) {
        addTabListeners(boxes, box.id, tab.id);
    });

    $("#box-content-" + box.id)
        .on("show.bs.collapse", function () {
            boxes.showBoxContent(box.id);
            $("#collapse-box-icon-" + box.id).toggleClass("fa-toggle-down fa-toggle-up");
        })
        .on("hide.bs.collapse", function () {
            boxes.hideBoxContent(box.id);
            $("#collapse-box-icon-" + box.id).toggleClass("fa-toggle-down fa-toggle-up");
        });

    $("#box-name-input-" + box.id)
        .on("focusout", function () {
            var name = $(this).val();
            boxes.changeBoxName(box.id, name);
            $(this).attr("hidden", "hidden");
            $("#switch-to-box-" + box.id)
                .text(name)
                .removeAttr("hidden");
        });

    box.tabs.forEach(function (tab) {
        addTabListeners(boxes, box.id, tab);
    });
}

function addTabListeners(boxes, boxId, tab) {
    $("#boxes")
        .on("click", "#remove-tab-" + tab.id, function () {
            boxes.removeTabFromBox(boxId, tab.id, function () {
                outputBoxes($('#search-input').val(), boxes);
            });
        })
        .on("click", "#tab-title-" + tab.id, function () {
            Tabs.selectTabByUrl(tab.url);
        });
}

$(document).ready(function () {
    Templates.loadPopupBoxTemplate(function (template) {
        boxTemplate = template;

        Boxes.loadBoxes(function (boxes) {
            outputBoxes($('#search-input').val(), boxes);
            addButtonsEventListeners(boxes);

            $('#crete-empty-tab-box-button').click(function (e) {
                createNewEmptyBox(boxes);
            });
            $('#put-tab-to-new-box-button').click(function (e) {
                Tabs.getCurrentTab(function (tab) {
                    putTabToNewBox(boxes, tab);
                });
            });
            $('#search-input').on('input', function (e) {
                searchQuery = $(this).val();
                outputBoxes(searchQuery, boxes);
            });
        });
    });
});