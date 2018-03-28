class TabController extends Controller {

    constructor() {
        super();
    }

    processSelectTabAction(action) {
        TabUtils.selectTabByUrl(action.source.model.url);
    }

    processEditTabAction(action) {
        ModalDialogFactory.createDialog('editTab', action.source.model,
            editedTab => {
                action.source.model.changeTitle(editedTab.title);
                action.source.model.changeUrl(editedTab.url);
            }).show();
    }
}