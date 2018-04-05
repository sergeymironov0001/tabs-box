var boxTemplate;
var tabTemplate;
var searchQuery;
var tabToEdit;
var boxOfEditTab;

function createNewEmptyBox(boxes) {
    var box = boxes.addNewBox();
    addBoxElement(box, generateBoxHtml(box));
    addBoxButtonsEventListeners(boxes, box);
    filterBox(searchQuery, boxes, box);
    // TabUtils.selectBoxTab(box.id);
}

function putTabToNewBox(boxes, activeTab) {
    var box = boxes.addNewBox();

    TabUtils.getCurrentTabPicture(function (dataUrl) {
        var tabInfo = new Tab(null, activeTab, dataUrl);
        boxes.putTabToBox(box.id, tabInfo);
        addBoxElement(box, generateBoxHtml(box));
        addBoxButtonsEventListeners(boxes, box)
        filterBox(searchQuery, boxes, box);
        // TabUtils.selectBoxTab(box.id);
    });
}

function putTabToExistingBox(boxes, boxId, tab, callback) {
    TabUtils.getCurrentTabPicture(function (dataUrl) {
        var tabInfo = new Tab(null, tab, dataUrl);
        if (boxes.putTabToBox(boxId, tabInfo)) {
            if (callback) {
                callback(tabInfo);
            }
        }
        // selectBoxTab(boxId);
        // TabUtils.closeTab(tab.id);
    });
}

function addTabHtml(box, tabHtml) {
    $('#box-content-' + box.id).append(tabHtml);
}

function generateTabElement(tab) {
    return Mustache.to_html(tabTemplate, tab);
}

function generateBoxHtml(box) {
    return Mustache.to_html(boxTemplate, box);
}

function addBoxElement(box, boxHtml) {
    $('#boxes').append(boxHtml);

    box.getTabs().forEach(function (tab) {
        addTabHtml(box, generateTabElement(tab));
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
        addBoxElement(box, generateBoxHtml(box));
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
            TabUtils.getCurrentTab(function (tab) {
                putTabToExistingBox(boxes, box.id, tab, function (tabInfo) {
                    addTabHtml(box, generateTabElement(tabInfo));
                    addTabListeners(boxes, box, tabInfo);
                });
            });
        })
        .on("click", "#switch-to-box-" + box.id, function () {
            TabUtils.selectBoxTab(box.id);
        })
        .on("click", "#remove-box-button-" + box.id, function () {
            boxes.removeBox(box);
            deleteBoxElement(box);
            TabUtils.closeBoxTab(box.id);
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
            console.log("Tab to remove: " + tab.id);
            boxes.removeTabFromBox(box.id, tab.id, function () {
                deleteTabElement(box, tab);
            });
        })
        .on("click", "#tab-title-" + tab.id, function () {
            TabUtils.selectTabByUrl(tab.url);
        })
        .on("click", "#edit-tab-" + tab.id, function () {
            boxOfEditTab = box;
            tabToEdit = tab;
            $("#tab-title-input").val(tab.title);
            $("#tab-url-input").val(tab.url);
        })
    ;
}

$(document).ready(function () {
    ThemesManager.init();
    ThemesManager.applySavedThemeToCurrentPage();

    Templates.loadPopupBoxTemplate(function (template) {
        boxTemplate = template;
        Templates.loadPopupTabTemplate(function (template) {
            tabTemplate = template;


            BoxesManager.loadBoxes(function (boxes) {
                outputBoxes(boxes);
                addButtonsEventListeners(boxes);

                $('#crete-empty-tab-box-button').click(function (e) {
                    createNewEmptyBox(boxes);
                });
                $('#put-tab-to-new-box-button').click(function (e) {
                    TabUtils.getCurrentTab(function (tab) {
                        putTabToNewBox(boxes, tab);
                    });
                });
                $('#open-options-button').click(function (e) {
                    TabUtils.selectOptionsTab();
                });
                $('#search-input').on('input', function (e) {
                    searchQuery = $(this).val();
                    filterBoxes(searchQuery, boxes);
                    // outputBoxes(searchQuery, boxes);
                });

                sortable('#boxes', {
                    handle: '.box-name'
                    // placeholderClass: 'box'
                });
                sortable('#boxes')[0].addEventListener('sortupdate', function (e) {
                    console.log(e.detail.item);
                    boxes.changeBoxPosition(e.detail.item.id, e.detail.index);
                });

                sortable('.box-content', {
                    handle: '.tab-title',
                    connectWith: 'connected'
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

                $('#save-edit-tab-button').click(function (e) {
                    if (tabToEdit) {
                        var title = $("#tab-title-input").val();
                        var url = $("#tab-url-input").val();
                        $("#tab-title-" + tabToEdit.id).text(title);
                        boxes.changeTabTitleAndUrl(boxOfEditTab.id, tabToEdit.id, title, url);
                    }
                });
            });
        });
    });
});