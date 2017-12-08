var tabsBoxId;
var tabsBoxName;
var tabsInfo = [];

function changeTabTitle(text) {
    $('head title', window.parent.document).text(text);
}

function generateUniqueId() {
    return Math.random().toString(36).substr(2, 16);
}

function tabWithTheSameUrlAlreadyExists(tabsArray, newTab) {
    var tabsWithTheSameUrl = tabsArray.filter(function (e) {
        return e.url === newTab.url;
    });
    return tabsWithTheSameUrl.length !== 0;
}

function putTabInBox(tabInfo) {
    console.log("Put tab in box");
    console.log(tabInfo);
    if (!tabWithTheSameUrlAlreadyExists(tabsInfo, tabInfo)) {
        tabInfo.id = generateUniqueId();
        tabsInfo.push(tabInfo);
    }
}

function deleteTabsInfo(tabsInfo, tabInfo) {
    tabsInfo.splice(tabsInfo.indexOf(tabInfo), 1);
}

function outputTabsInfo(tabsInfo) {
    console.log("Output tabs");
    var newHTML = $.map(tabsInfo, function (tabInfo) {
        console.log(tabInfo);
        return ('<a href="' + tabInfo.url + '" target="_blank" title="' + tabInfo.title + '">' +
            '<div id="' + tabInfo.id + '" class="tab container m-1">' +
            '   <div class="row">' +
            '       <div class="col-2 p-1 m-0 tab-favicon">' +
            '           <img src="' + tabInfo.faviconUrl + '"/>' +
            '       </div>' +
            '       <div class="tab-title col-8 p-1 m-0">' + tabInfo.title + '</div>' +
            '       <div class="col-2 p-1 m-0 tab-close">' +
            '           <button id="close-' + tabInfo.id + '" type="button" class="close tab-close-button" aria-label="Close">' +
            '               &times;' +
            '           </button>' +
            '       </div>' +
            '   </div>' +
            '   <div class="row">' +
            '       <div>' +
            '           <img id="thumb-' + tabInfo.tab.id + '" src="' + tabInfo.thumbImgUrl + '"/>' +
            '       </div>' +
            '   </div>' +
            '</div>' +
            '</a>');
    });
    $("#box").html(newHTML.join(""));
    tabsInfo.forEach(function (tabInfo, i, arr) {
        console.log(tabInfo.id);
        $("#close-" + tabInfo.id).click(function (e) {
            e.preventDefault();
            $("#" + tabInfo.id).remove();
            deleteTabsInfo(tabsInfo, tabInfo.id);
        });
    });
}

$(document).ready(function () {
    changeTabTitle(tabsBoxName);

    $('#tabs-box-name-input').focusout(function () {
        tabsBoxName = $(this).val();

        chrome.runtime.sendMessage({
                type: "tabs-box:change-box-name",
                id: tabsBoxId,
                name: tabsBoxName
            },
            function (response) {
            }
        );

        changeTabTitle(tabsBoxName);
    }).val(tabsBoxName);
});

// Send notification to popup what new box was created
chrome.runtime.sendMessage({type: "tabs-box:box-created"}, function (boxInfo) {
    console.log("Box info:");
    console.log(boxInfo);
    if (boxInfo !== undefined && boxInfo !== null) {
        tabsBoxId = boxInfo.id;
        tabsBoxName = boxInfo.name;
        changeTabTitle(tabsBoxName);

        putTabInBox(boxInfo.tab);
        outputTabsInfo(tabsInfo);

        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
                if ("tabs-box:put-in-box" === request.type && tabsBoxId === request.boxId) {
                    putTabInBox(request.tabInfo);
                    outputTabsInfo(tabsInfo);
                    sendResponse();
                }
            }
        );
    }
});
