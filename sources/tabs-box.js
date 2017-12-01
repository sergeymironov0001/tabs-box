var tabsInfo = [];

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.hasOwnProperty("type") && request.type === "tabs-box:put-in-box") {

            if (!tabWithTheSameUrlAlreadyExists(tabsInfo, request.tabInfo)) {
                tabsInfo.push(request.tabInfo);
            }
            // alert(request.url);
            outputTabsInfo(tabsInfo)
        }
        sendResponse({});
    }
);

function tabWithTheSameUrlAlreadyExists(tabsArray, newTab) {
    var tabsWithTheSameUrl = tabsArray.filter(function (e) {
        return e.url === newTab.url;
    });
    return tabsWithTheSameUrl.length !== 0;
}

function outputTabsInfo(tabsInfo) {
    var newHTML = $.map(tabsInfo, function (tabInfo) {
        return ('<a href="' + tabInfo.url + '" target="_blank" title="' + tabInfo.title + '">' +
            '<div class="tab container m-1">' +
            '   <div class="row">' +
            '       <div class="col-md-2 p-1 m-0 tab-favicon">' +
            '           <img src="' + tabInfo.faviconUrl + '"/>' +
            '       </div>' +
            '       <div class="tab-title col-md-8 p-1 m-0" >' + tabInfo.title + '</div>' +
            // '       <div class="col-md-2 m-1"><div class="span1"/></div>' +
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

    // tabsInfo.forEach(function (tabInfo) {
    //     console.log(tabInfo);
    //     tabInfo.tab.captureVisibleTab(null, {}, function (dataUrl) {
    //         console.log(dataUrl);
    //         $("#thumb-" + tabsInfo.tab.id).src = dataUrl;
    //     })
    // });
}

chrome.runtime.sendMessage({"type": "tabs-box:box-created"}, function (tabInfo) {
    // console.log(new URL(tabInfo.url));
    if (tabInfo !== undefined) {
        tabsInfo.push(tabInfo);
        outputTabsInfo(tabsInfo);
    }
});

var tabsBoxName = "Tabs Box";


function changeTabTitle(text) {
    $('head title', window.parent.document).text(text);
}

$(document).ready(function () {
    changeTabTitle(tabsBoxName);

    $('#tabs-box-name-input')
        .focusout(function () {
            tabsBoxName = $(this).val();
            changeTabTitle(tabsBoxName);
        })
        .val(tabsBoxName);
});


//
// /**
//  * Get the current URL.
//  *
//  * @param {function(string)} callback called when the URL of the current tab
//  *   is found.
//  */
// function getCurrentTabUrl(callback) {
//     // Query filter to be passed to chrome.tabsBoxes.query - see
//     // https://developer.chrome.com/extensions/tabs#method-query
//     var queryInfo = {
//         active: true,
//         currentWindow: true
//     };
//
//     chrome.tabsBoxes.query(queryInfo, (tabsBoxes) = > {
//         // chrome.tabsBoxes.query invokes the callback with a list of tabsBoxes that match the
//         // query. When the popup is opened, there is certainly a window and at least
//         // one tab, so we can safely assume that |tabsBoxes| is a non-empty array.
//         // A window can only have one active tab at a time, so the array consists of
//         // exactly one tab.
//         var tab = tabsBoxes[0];
//
//     // A tab is a plain object that provides information about the tab.
//     // See https://developer.chrome.com/extensions/tabs#type-Tab
//     var url = tab.url;
//
//     // tab.url is only available if the "activeTab" permission is declared.
//     // If you want to see the URL of other tabsBoxes (e.g. after removing active:true
//     // from |queryInfo|), then the "tabsBoxes" permission is required to see their
//     // "url" properties.
//     console.assert(typeof url == 'string', 'tab.url should be a string');
//
//     callback(url);
// })
//     ;
//
//     // Most methods of the Chrome extension APIs are asynchronous. This means that
//     // you CANNOT do something like this:
//     //
//     // var url;
//     // chrome.tabsBoxes.query(queryInfo, (tabsBoxes) => {
//     //   url = tabsBoxes[0].url;
//     // });
//     // alert(url); // Shows "undefined", because chrome.tabsBoxes.query is async.
// }
//
// /**
//  * Change the background color of the current page.
//  *
//  * @param {string} color The new background color.
//  */
// function changeBackgroundColor(color) {
//     var script = 'document.body.style.backgroundColor="' + color + '";';
//     // See https://developer.chrome.com/extensions/tabs#method-executeScript.
//     // chrome.tabsBoxes.executeScript allows us to programmatically inject JavaScript
//     // into a page. Since we omit the optional first argument "tabId", the script
//     // is inserted into the active tab of the current window, which serves as the
//     // default.
//     // chrome.tabsBoxes.executeScript({
//     //   code: script
//     // });
// }
//
// /**
//  * Gets the saved background color for url.
//  *
//  * @param {string} url URL whose background color is to be retrieved.
//  * @param {function(string)} callback called with the saved background color for
//  *     the given url on success, or a falsy value if no color is retrieved.
//  */
// function getSavedBackgroundColor(url, callback) {
//     // See https://developer.chrome.com/apps/storage#type-StorageArea. We check
//     // for chrome.runtime.lastError to ensure correctness even when the API call
//     // fails.
//     chrome.storage.sync.get(url, (items) = > {
//         callback(chrome.runtime.lastError ? null : items[url]
// )
//     ;
// })
//     ;
// }
//
// /**
//  * Sets the given background color for url.
//  *
//  * @param {string} url URL for which background color is to be saved.
//  * @param {string} color The background color to be saved.
//  */
// function saveBackgroundColor(url, color) {
//     var items = {};
//     items[url] = color;
//     // See https://developer.chrome.com/apps/storage#type-StorageArea. We omit the
//     // optional callback since we don't need to perform any action once the
//     // background color is saved.
//     chrome.storage.sync.set(items);
// }
//
// // This extension loads the saved background color for the current tab if one
// // exists. The user can select a new background color from the dropdown for the
// // current page, and it will be saved as part of the extension's isolated
// // storage. The chrome.storage API is used for this purpose. This is different
// // from the window.localStorage API, which is synchronous and stores data bound
// // to a document's origin. Also, using chrome.storage.sync instead of
// // chrome.storage.local allows the extension data to be synced across multiple
// // user devices.
// document.addEventListener('DOMContentLoaded', () = > {
//     getCurrentTabUrl((url) =
// >
// {
//     var dropdown = document.getElementById('dropdown');
//
//     // Load the saved background color for this page and modify the dropdown
//     // value, if needed.
//     getSavedBackgroundColor(url, (savedColor) = > {
//         if(savedColor) {
//             changeBackgroundColor(savedColor);
//             dropdown.value = savedColor;
//         }
//     }
// )
//     ;
//
//     // Ensure the background color is changed and saved when the dropdown
//     // selection changes.
//     dropdown.addEventListener('change', () = > {
//         changeBackgroundColor(dropdown.value
// )
//     ;
//     saveBackgroundColor(url, dropdown.value);
// })
//     ;
// }
// )
// ;
// })
// ;
