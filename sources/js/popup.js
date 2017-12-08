var tabsBoxes = [];

// chrome.browserAction.onClicked.addListener(function (activeTab) {
//     // var newURL = "http://www.youtube.com/";
//     // chrome.tabsBoxes.create({ url: newURL });
//     // chrome.tabsBoxes.getSelected(null,function(tab) {
//     //     var tablink = tab.url;
//     // });
//     // alert(activeTab.url);
//
//     addTabToTabsBox(activeTab);
// });

function putTabIntoNewBox(tabsBoxes, activeTab) {
    console.log("Active tab:");
    console.log(activeTab);
    chrome.tabs.captureVisibleTab(chrome.windows.WINDOW_ID_CURRENT, function (dataUrl) {
        chrome.tabs.create({
                'url': chrome.extension.getURL('html/tabs-box.html'),
                'active': false,
                'selected': false
            },
            function (createdTabsBox) {
                var tabsBoxOnCreateListener = function (request, sender, sendResponse) {
                    console.log("Box created");
                    console.log(request);

                    if (createdTabsBox.id === sender.tab.id &&
                        request.type === "tabs-box:box-created") {

                        var tabsBoxInfo = createTabBoxInfo(createdTabsBox.id);
                        tabsBoxInfo.tab = createTabInfo(activeTab, dataUrl);

                        sendResponse(tabsBoxInfo);

                        chrome.runtime.onMessage.removeListener(tabsBoxOnCreateListener);

                        tabsBoxes.push(tabsBoxInfo);
                        TabsBoxes.saveTabsBoxes(tabsBoxes);
                        outputBoxes(tabsBoxes);
                    }
                };
                chrome.runtime.onMessage.addListener(tabsBoxOnCreateListener);
            }
        );
    });
}

function putTabIntoExistingBox(tab, boxId) {
    console.log("Put tab into existing box:");
    console.log(boxId);
    chrome.tabs.captureVisibleTab(chrome.windows.WINDOW_ID_CURRENT, function (dataUrl) {
        var tabInfo = createTabInfo(tab, dataUrl);
        chrome.runtime.sendMessage({
                type: "tabs-box:put-in-box",
                boxId: boxId,
                tabInfo: tabInfo
            },
            function (response) {
                // closeTab(tab.id);
            }
        );
    });
}

function outputBoxes(tabsBoxes) {
    var newHTML = $.map(tabsBoxes, function (tabsBox) {
        console.log(tabsBox);
        return (
            '<div class="row m-0 pb-1">' +
            '   <div class="col-2 p-0 text-center pr-1">' +
            '       <button id="add-to-box-' + tabsBox.id + '" type="button" class="btn">+</button>' +
            '   </div>' +
            '   <div class="col-8 p-0 text-center pr-1">' +
            '       <button id="select-box-' + tabsBox.id + '" type="button" class="btn"> ' +
            '           ' + tabsBox.name +
            '       </button>' +
            '   </div>' +
            '   <div class="col-2 p-0 text-center">' +
            '       <button id="close-box-' + tabsBox.id + '" type="button" class="btn">&times;</button>' +
            '   </div>' +
            '</div>'
        );
    });
    $("#boxes").html(newHTML.join(""));
    tabsBoxes.forEach(function (tabsBox, i, arr) {
        $("#add-to-box-" + tabsBox.id).click(function (e) {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                var tab = tabs[0];
                putTabIntoExistingBox(tab, tabsBox.id);
            });
        });

        $("#select-box-" + tabsBox.id).click(function (e) {
            selectTab(tabsBox.id);
        });

        $("#close-box-" + tabsBox.id).click(function (e) {
            TabsBoxes.closeBox(tabsBoxes, tabsBox.id);
            outputBoxes(tabsBoxes);
            closeTab(tabsBox.id);
        });
    });
}

function createTabInfo(tab, thumbImgUrl) {
    return {
        url: tab.url,
        title: tab.title,
        faviconUrl: getFaviconUrl(tab),
        thumbImgUrl: thumbImgUrl,
        tab: tab
    };
}

function createTabBoxInfo(boxId) {
    var boxName = "Tabs box";
    return {
        id: boxId,
        name: boxName
    };
}

function getFaviconUrl(tab) {
    return tab.favIconUrl;
}

function selectTab(tabId) {
    chrome.tabs.update(tabId, {selected: true});
}

function closeTab(tabId) {
    chrome.tabs.remove(tabId, function () {
    });
}

chrome.tabs.onRemoved.addListener(function callback(tabId) {
    // remove closed tab from the tabsBoxes list
    tabsBoxes = tabsBoxes.filter(function (tabsBox) {
        return tabsBox.id !== tabId;
    });
});

// chrome.tabs.onRemoved.addListener(function (tabId, removed) {
//     closeBox(tabsBoxes, tabId);
// });

// chrome.windows.onRemoved.addListener(function (windowid) {
//     // TODO process the event
//     // alert("window closed")
// });

$(document).ready(function () {
    TabsBoxes.loadTabsBoxes(function (tabsBoxes) {
        outputBoxes(tabsBoxes);

        $('#crete-new-tab-box-button').click(function (e) {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                var tab = tabs[0];
                putTabIntoNewBox(tabsBoxes, tab);
            });
        });
    });
});