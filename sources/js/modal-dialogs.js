class ModalDialog {
    constructor() {
        this._addActions();
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

    _addActions() {
        this._getOkButton().click(e => {
            this._updateData();
            this.okAction(this.data);
        });
    }
}

class ConfirmBoxRemoveModalDialog extends ModalDialog {

    constructor() {
        super();

        // $('#confirm-box-remove-modal').on('shown.bs.modal', e => {
        //     this._getOkButton().trigger('focus');
        // });
    }

    show() {
        this._setText();
        $('#confirm-box-remove-modal').modal();
    }

    _getOkButton() {
        return $('#confirm-box-remove-button');
    }

    _updateData() {
    }

    _getBoxNameField() {
        return $('#box-name');
    }

    _setText() {
        this._getBoxNameField().text(this.data.name);
    }
}

class EditTabModalDialog extends ModalDialog {

    constructor() {
        super();

        $('#edit-tab-modal').on('shown.bs.modal', e => {
            this._getTitleInputField().trigger('focus');
        });
    }

    show() {
        this._setTitle();
        this._setUrl();
        $('#edit-tab-modal').modal();

        let input = this._getTitleInputField();
        input.focus();
        let position = input.value.length;
        input.setSelectionRange(position, position)
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

class EditBoxModalDialog extends ModalDialog {

    constructor() {
        super();

        $('#edit-box-modal').on('shown.bs.modal', e => {
            this._getBoxNameInputField().trigger('focus');
        });
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

        let confirmBoxRemoveModalDialogHtml = Mustache.to_html(
            ModalDialogFactory.confirmBoxRemoveModalDialogTemplate, {});
        parentElement.append(confirmBoxRemoveModalDialogHtml);

        ModalDialogFactory.editTabModalDialog = new EditTabModalDialog();
        ModalDialogFactory.editBoxModalDialog = new EditBoxModalDialog();
        ModalDialogFactory.confirmBoxRemoveModalDialog =
            new ConfirmBoxRemoveModalDialog();
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
            case "confirmBoxRemove":
                ModalDialogFactory.confirmBoxRemoveModalDialog.setData(data);
                ModalDialogFactory.confirmBoxRemoveModalDialog.setOkAction(okAction);
                return ModalDialogFactory.confirmBoxRemoveModalDialog;
            default:
                return null
        }
    }
}

Templates.loadEditTabDialogTemplate(template =>
    ModalDialogFactory.editTabModalDialogTemplate = template);

Templates.loadEditBoxDialogTemplate(template =>
    ModalDialogFactory.editBoxModalDialogTemplate = template);

Templates.loadConfirmBoxRemoveDialogTemplate(template =>
    ModalDialogFactory.confirmBoxRemoveModalDialogTemplate = template);