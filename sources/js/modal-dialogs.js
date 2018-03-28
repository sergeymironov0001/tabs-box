class EditModalDialog {
    constructor() {
        this._addListeners();
    }

    setData(data) {
        this.data = data;
    }

    setOkAction(okAction) {
        this.okAction = okAction;
    }

    show() {
        // subclass have to implement this
    }

    _getOkButton() {
        // subclass have to implement this
    }

    _updateData() {
        // subclass have to implement this
    }

    _addListeners() {
        var self = this;
        this._getOkButton().click(function (e) {
            self._updateData();
            self.okAction(self.data);
        });
    }
}

class EditTabModalDialog extends EditModalDialog {

    constructor() {
        super();
    }

    show() {
        this._setTitle();
        this._setUrl();
        $('#edit-tab-modal').modal();
    }

    _getOkButton() {
        return $('#save-edit-tab-button');
    }

    _updateData() {
        this.data.title = this._getTitleInputField().val();
        this.data.url = this._getUrlInputField().val();
    }

    _getTitleInputField() {
        return $('#tab-title-input');
    }

    _getUrlInputField() {
        return $('#tab-url-input');
    }

    _setTitle() {
        this._getTitleInputField().val(this.data.title);
    }

    _setUrl() {
        this._getUrlInputField().val(this.data.url);
    }
}

class EditBoxModalDialog extends EditModalDialog {

    constructor() {
        super();
    }

    show() {
        this._setName();
        $('#edit-box-modal').modal();
    }

    _getOkButton() {
        return $('#save-edit-box-button');
    }

    _updateData() {
        this.data.name = this._getBoxNameInputField().val();
    }

    _getBoxNameInputField() {
        return $('#box-name-input');
    }

    _setName() {
        this._getBoxNameInputField().val(this.data.name);
    }
}

class ModalDialogFactory {

    static initModals(parentElement) {
        let editTabDialogHtml = Mustache.to_html(
            ModalDialogFactory.editTabModalDialogTemplate, {});
        parentElement.append(editTabDialogHtml);

        let editBoxDialogHtml = Mustache.to_html(
            ModalDialogFactory.editBoxModalDialogTemplate, {});
        parentElement.append(editBoxDialogHtml);

        ModalDialogFactory.editTabModalDialog = new EditTabModalDialog();
        ModalDialogFactory.editBoxModalDialog = new EditBoxModalDialog();
    }

    static createDialog(dialogType, data, okAction) {
        switch (dialogType) {
            case "editTab":
                ModalDialogFactory.editTabModalDialog.setData(data);
                ModalDialogFactory.editTabModalDialog.setOkAction(okAction);
                return ModalDialogFactory.editTabModalDialog;
            case "editBox":
                ModalDialogFactory.editBoxModalDialog.setData(data);
                ModalDialogFactory.editBoxModalDialog.setOkAction(okAction);
                return ModalDialogFactory.editBoxModalDialog;
            default:
                return null
        }
    }
}

Templates.loadEditTabTemplate(function (template) {
    ModalDialogFactory.editTabModalDialogTemplate = template;
});

Templates.loadEditBoxTemplate(function (template) {
    ModalDialogFactory.editBoxModalDialogTemplate = template;
});