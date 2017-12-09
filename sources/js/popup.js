function putTabIntoNewBox(boxes, activeTab) {
    Tabs.getCurrentTabPicture(function (dataUrl) {
        Tabs.createNewTab(function (createdTabsBox) {
                var box = Boxes.createBox(createdTabsBox.id);
                box.tab = Tabs.createTabInfo(activeTab, dataUrl);
                boxes.push(box);
                outputBoxes(boxes);
                Boxes.saveBoxes(boxes);

                Notifications.createTabBoxListener(createdTabsBox.id, function (sendResponse) {
                    sendResponse(box);
                });
            }
        );
    });
}

function putTabIntoExistingBox(tab, boxId) {
    Tabs.getCurrentTabPicture(function (dataUrl) {
        var tabInfo = Tabs.createTabInfo(tab, dataUrl);

        Notifications.sendPutTabInBox(boxId, tabInfo, function (response) {
            // Tabs.closeTab(tab.id);
        });
    });
}

function outputBoxes(boxes) {
    var newHTML = $.map(boxes, function (box) {
        console.log(box);
        return (
            '<div class="row m-0 pb-1">' +
            '   <div class="col-2 p-0 text-center pr-1">' +
            '       <button id="add-to-box-' + box.id + '" type="button" class="btn">+</button>' +
            '   </div>' +
            '   <div class="col-8 p-0 text-center pr-1">' +
            '       <button id="select-box-' + box.id + '" type="button" class="btn"> ' +
            '           ' + box.name +
            '       </button>' +
            '   </div>' +
            '   <div class="col-2 p-0 text-center">' +
            '       <button id="close-box-' + box.id + '" type="button" class="btn">&times;</button>' +
            '   </div>' +
            '</div>'
        );
    });
    $("#boxes").html(newHTML.join(""));
    boxes.forEach(function (box, i, arr) {
        $("#add-to-box-" + box.id).click(function (e) {
            Tabs.getCurrentTab(function (tab) {
                putTabIntoExistingBox(tab, box.id);
            });
        });

        $("#select-box-" + box.id).click(function (e) {
            Tabs.selectTab(box.id);
        });

        $("#close-box-" + box.id).click(function (e) {
            Boxes.closeBox(boxes, box.id);
            outputBoxes(boxes);
            Tabs.closeTab(box.id);
        });
    });
}

$(document).ready(function () {
    Boxes.getBoxes(function (boxes) {
        outputBoxes(boxes);

        $('#crete-new-tab-box-button').click(function (e) {
            Tabs.getCurrentTab(function (tab) {
                putTabIntoNewBox(boxes, tab);
            });
        });
    });
});