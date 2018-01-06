class Templates {
    static loadPopupBoxTemplate(callback) {
        Templates._loadTemplate("../templates/popup-box.html", callback);
    };

    static loadTabSnapshotTemplate(callback) {
        Templates._loadTemplate("../templates/tab-snapshot.html", callback);
    };

    static _loadTemplate(templateName, callback) {
        $.get(chrome.extension.getURL(templateName), function (template) {
            Mustache.parse(template);
            callback(template);
        });
    }
}


