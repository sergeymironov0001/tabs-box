var tabSnapshotTemplate;
var searchQuery;

var changeTabPositionFunc;

function getUrlParam(name) {
    if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
}

function outputTabs(searchQuery, boxes, box) {
    var tabs = box.getTabs();
    if (searchQuery) {
        tabs = searchTabs(searchQuery, tabs);
    }
    var tabsInfoHtml = $.map(tabs, function (tab) {
        return Mustache.to_html(tabSnapshotTemplate, tab);
    });
    $('#box').html(tabsInfoHtml.join(""));

    if (!changeTabPositionFunc) {
        changeTabPositionFunc = function (e, ui) {
            boxes.changeTabPosition(box.id, ui.item[0].id, ui.item.index());
        }
    } else {
        $('#box').unbind('sortupdate', changeTabPositionFunc);
    }

    $('#box').sortable({
        placeholderClass: 'tab'
    }).bind('sortupdate', changeTabPositionFunc);
}

function addTabsEventListeners(boxes, box) {
    box.tabs.forEach(function (tab) {
        addTabEventListener(boxes, box, tab);
    });
}

function addTabEventListener(boxes, box, tab) {
    $("#box")
        .on("click", "#close-" + tab.id, function (e) {
            e.stopPropagation();
            $("#" + tab.id).remove();
            boxes.removeTabFromBox(box.id, tab.id);
        })
        .on("click", "#thumb-" + tab.id, function (e) {
            Tabs.selectTabByUrl(tab.url);
        });
}

function searchTabs(query, tabs) {
    var q = query.toLowerCase();
    return tabs.filter(function (tab) {
        return tab.url.toLowerCase().indexOf(q) !== -1 ||
            tab.title.toLowerCase().indexOf(q) !== -1;
    });
}

function addBoxEventListeners(boxes, box) {
    $('#tabs-box-name-input').focusout(function () {
        var name = $(this).val();
        boxes.changeBoxName(box.id, name);
        Tabs.changeTabTitle(box.name);
    }).val(box.name);

    $('#tabs-search').on('input', function (e) {
        searchQuery = $(this).val();
        outputTabs(searchQuery, boxes, box);
    });

    $('#open-all-tabs').click(function (e) {
        box.getTabs().forEach(function (tabInfo) {
            Tabs.getTabByUrl(tabInfo.url, function (tab) {
                if (!tab) {
                    Tabs.createTab(tabInfo.url);
                }
            });
        })
    });

    $('#close-all-tabs').click(function (e) {
        box.getTabs().forEach(function (tabInfo) {
            Tabs.getTabsByUrl(tabInfo.url, function (tabs) {
                tabs.forEach(function (tab) {
                    Tabs.closeTab(tab.id);
                });
            });
        });
    });
}

$(document).ready(function () {
    Templates.loadTabSnapshotTemplate(function (template) {
        tabSnapshotTemplate = template;
    });

    Boxes.loadBoxes(function (boxes) {
        var boxId = getUrlParam("boxId");
        var box = boxes.getBoxById(boxId);

        Tabs.changeTabTitle(box.name);
        outputTabs(searchQuery, boxes, box);
        addTabsEventListeners(boxes, box);

        addBoxEventListeners(boxes, box);

        Notifications.addPutTabToBoxListener(box.id, function (tab) {
            outputTabs(searchQuery, boxes, box);
            addTabEventListener(boxes, box, tab);
        });

        Notifications.addRemoveTabFromBoxListener(box.id, function (tabId) {
           outputTabs(searchQuery, boxes, box);
        });
    });
});


