var tabSnapshotTemplate;
var searchQuery;

function getUrlParam(name) {
    if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
}

function outputTabs(searchQuery, tabs) {
    if (searchQuery) {
        tabs = searchTabs(searchQuery, tabs);
    }
    var tabsInfoHtml = $.map(tabs, function (tab) {
        return Mustache.to_html(tabSnapshotTemplate, tab);
    });
    $("#box").html(tabsInfoHtml.join(""));
}

function addTabsEventListeners(boxes, box) {
    box.tabs.forEach(function (tab) {
        addTabEventListener(boxes, box, tab);
    });
}

function addTabEventListener(boxes, box, tab) {
    $("#box")
        .on("click", "#close-" + tab.id, function (e) {
            e.preventDefault();
            $("#" + tab.id).remove();
            boxes.removeTabFromBox(box.id, tab);
        });
}

function searchTabs(query, tabs) {
    var q = query.toLowerCase();
    return tabs.filter(function (tab) {
        return tab.url.toLowerCase().indexOf(q) !== -1 ||
            tab.title.toLowerCase().indexOf(q) !== -1;
    });
}

$(document).ready(function () {
    Templates.loadTabSnapshotTemplate(function (template) {
        tabSnapshotTemplate = template;
    });

    Boxes.loadBoxes(function (boxes) {
        var boxId = getUrlParam("boxId");
        var box = boxes.getBoxById(boxId);

        $('#tabs-box-name-input').focusout(function () {
            var name = $(this).val();
            boxes.changeBoxName(boxId, name);
            Tabs.changeTabTitle(box.name);
        }).val(box.name);

        $('#tabs-search').on('input', function (e) {
            searchQuery = $(this).val();
            outputTabs(searchQuery, box.getTabs());
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
                Tabs.getTabByUrl(tabInfo.url, function (tab) {
                    if (tab) {
                        Tabs.closeTab(tab.id);
                    }
                });
            })
        });

        Tabs.changeTabTitle(box.name);
        outputTabs(searchQuery, box.getTabs());
        addTabsEventListeners(boxes, box);

        Notifications.addPutTabToBoxListener(box.id, function (tab) {
            outputTabs(searchQuery, box.getTabs());
            addTabEventListener(boxes, box, tab);
        });
    });
});


