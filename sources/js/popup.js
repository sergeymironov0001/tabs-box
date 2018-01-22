var boxTemplate;
var tabTemplate;
var searchQuery;

function createNewEmptyBox(boxes) {
    var box = boxes.addNewBox();
    addBoxElement(box);
    addBoxButtonsEventListeners(boxes, box);
    filterBox(searchQuery, boxes, box);
    // Tabs.selectBoxTab(box.id);
}

function putTabToNewBox(boxes, activeTab) {
    var box = boxes.addNewBox();

    Tabs.getCurrentTabPicture(function (dataUrl) {
        var tabInfo = new Tab(null, activeTab, dataUrl);
        boxes.putTabToBox(box.id, tabInfo);
        addBoxElement(box);
        addBoxButtonsEventListeners(boxes, box)
        filterBox(searchQuery, boxes, box);
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

function addTabElement(box, tab) {
    var tabHtml = Mustache.to_html(tabTemplate, tab);
    $('#box-content-' + box.id).append(tabHtml);
}

function addBoxElement(box) {
    var boxHtml = Mustache.to_html(boxTemplate, box);
    $('#boxes').append(boxHtml);

    box.getTabs().forEach(function (tab) {
        addTabElement(box, tab);
    });
    if (box.showContent) {
        $("#box-content-" + box.id).addClass('show');
        $("#collapse-box-icon-" + box.id).toggleClass("fa-toggle-down fa-toggle-up");
    }
}

function deleteBoxElement(box) {
    $('#' + box.id).remove();
}

function deleteTabElement(box, tab) {
    $('#tab-' + tab.id).remove();
    // $('#' + box.id).remove('#tab-' + tab.id);
}


function outputBoxes(boxes) {
    boxes.getBoxes().forEach(function (box) {
        addBoxElement(box);
    });
}

function removeFilters(boxes) {
    showBoxes(boxes);
    boxes.forEach(removeFiltersFromBox);
}

function removeFiltersFromBox(box) {
    showBox(box);
    showTabs(box.getTabs());
    if (!box.showContent && $("#box-content-" + box.id).hasClass("show")) {
        $("#box-content-" + box.id).removeClass('show');
        $("#collapse-box-icon-" + box.id).toggleClass("fa-toggle-down fa-toggle-up");
    }
}

function filterBoxes(searchQuery, boxes) {
    boxes.getBoxes().forEach(function (box) {
        filterBox(searchQuery, boxes, box);
    });
}

function filterBox(searchQuery, boxes, box) {
    if (!searchQuery || searchQuery.length === 0) {
        removeFiltersFromBox(box);
        return;
    }
    var tabs = box.searchTabs(searchQuery);
    if (tabs.length === 0) {
        hideBox(box);
        return;
    }
    showBox(box);
    hideTabs(box.getTabs());
    if (tabs.length > 0) {
        $("#box-content-" + box.id).addClass('show');
        $("#collapse-box-icon-" + box.id)
            .removeClass('fa-toggle-down')
            .addClass('fa-toggle-up');
    }
    showTabs(tabs);
}

function hideBoxes(boxes) {
    boxes.forEach(hideBox);
}

function hideBox(box) {
    $("#" + box.id).attr("hidden", "hidden");
}

function showBox(box) {
    $("#" + box.id).removeAttr("hidden");
}

function showBoxes(boxes) {
    boxes.forEach(function (box) {
        $("#" + box.id).removeAttr("hidden");
    })
}

function hideTabs(tabs) {
    tabs.forEach(function (tab) {
        $("#tab-" + tab.id).attr("hidden", "hidden");
    })
}

function showTabs(tabs) {
    tabs.forEach(function (tab) {
        $("#tab-" + tab.id).removeAttr("hidden");
    })
}

function addButtonsEventListeners(boxes) {
    boxes.getBoxes().forEach(function (box) {
        addBoxButtonsEventListeners(boxes, box);
    });
}

var renameBox = function (box) {
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
};

function addBoxButtonsEventListeners(boxes, box) {
    $("#boxes")
        .on("click", "#add-to-box-button-" + box.id, function () {
            Tabs.getCurrentTab(function (tab) {
                putTabToExistingBox(boxes, box.id, tab, function (tabInfo) {
                    addTabElement(box, tab);
                    addTabListeners(boxes, box, tab);
                });
            });
        })
        .on("click", "#switch-to-box-" + box.id, function () {
            Tabs.selectBoxTab(box.id);
        })
        .on("click", "#remove-box-button-" + box.id, function () {
            boxes.removeBox(box);
            deleteBoxElement(box);
            Tabs.closeBoxTab(box.id);
        })
        .on("click", "#rename-box-button-" + box.id, function () {
            renameBox(box);
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
        addTabListeners(boxes, box, tab);
    });
}

function addTabListeners(boxes, box, tab) {
    $("#boxes")
        .on("click", "#remove-tab-" + tab.id, function () {
            boxes.removeTabFromBox(box.id, tab.id, function () {
                deleteTabElement(box, tab);
            });
        })
        .on("click", "#tab-title-" + tab.id, function () {
            Tabs.selectTabByUrl(tab.url);
        });
}

$(document).ready(function () {
    Templates.loadPopupBoxTemplate(function (template) {
        boxTemplate = template;
        Templates.loadPopupTabTemplate(function (template) {
            tabTemplate = template;

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
                $('#search-input').on('input', function (e) {
                    searchQuery = $(this).val();
                    filterBoxes(searchQuery, boxes);
                    // outputBoxes(searchQuery, boxes);
                });

                $('#boxes')
                    .sortable({
                        placeholderClass: 'box'
                    })
                    .bind('sortupdate', function (e, ui) {
                        boxes.changeBoxPosition(ui.item[0].id, ui.item.index());
                    });
            });
        });
    });
});