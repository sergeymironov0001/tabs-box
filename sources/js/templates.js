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

    static loadConfirmBoxRemoveDialogTemplate(callback) {
        Templates._loadTemplate("../templates/confirm-box-remove-dialog.html", callback);
    };

    static loadEditTabDialogTemplate(callback) {
        Templates._loadTemplate("../templates/edit-tab-dialog.html", callback);
    };

    static loadEditBoxDialogTemplate(callback) {
        Templates._loadTemplate("../templates/edit-box-dialog.html", callback);
    };

    static loadThemesTemplate(callback) {
        Templates._loadTemplate("../templates/themes.html", callback);
    };

    static _loadTemplate(templateName, callback) {
        $.get(chrome.extension.getURL(templateName), function (template) {
            Mustache.parse(template);
            callback(template);
        });
    }
}


