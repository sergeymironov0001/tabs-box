function Templates() {
}

function loadTemplate(templateName, callback) {
    $.get(chrome.extension.getURL(templateName), function (template) {
        Mustache.parse(template);
        callback(template);
    });
}

Templates.loadPopupBoxTemplate = function (callback) {
    loadTemplate("../templates/popup-box.html", callback);
};

Templates.loadTabSnapshotTemplate = function (callback) {
    loadTemplate("../templates/tab-snapshot.html", callback);
};


