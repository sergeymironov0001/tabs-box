class Templates {
    static loadPopupBoxTemplate(callback) {
        Templates._loadTemplate("../templates/popup-box.html", callback);
    };

    static loadPopupTabTemplate(callback) {
        Templates._loadTemplate("../templates/popup-tab.html", callback);
    };

    static loadTabSnapshotTemplate(callback) {
        Templates._loadTemplate("../templates/tab-snapshot.html", callback);
    };

    static loadEditTabTemplate(callback) {
        Templates._loadTemplate("../templates/edit-tab-dialog.html", callback);
    }

    static loadEditBoxTemplate(callback) {
        Templates._loadTemplate("../templates/edit-box-dialog.html", callback);
    }

    static _loadTemplate(templateName, callback) {
        $.get(chrome.extension.getURL(templateName), function (template) {
            Mustache.parse(template);
            callback(template);
        });
    }
}


