class BoxController extends Controller {

    constructor() {
        super();
    }

    processAddTabAction(action) {
        TabUtils.getCurrentTab(tabInfo => {
            action.source.model.addTab({
                title: tabInfo.title,
                url: tabInfo.url,
                favIconUrl: tabInfo.favIconUrl
            });
        });
    }

    processSelectBoxAction(action) {
        TabUtils.selectBoxTab(action.source.model.id);
    }

    processRenameBoxAction(action) {
        ModalDialogFactory.createDialog('editBox', action.source.model,
            editedBox =>
                action.source.model.changeName(editedBox.name)
        ).show();
    }

    processRemoveBoxAction(action) {
        TabUtils.closeBoxTab(action.source.model.id);
    }

    processExpandBoxAction(action) {
        action.source.model.expand();
    }

    processCollapseBoxAction(action) {
        action.source.model.collapse();
    }

    processRemoveTabAction(action) {
        action.source.model.removeTab(action.data.model.id);
    }

    processTabPositionChangedAction(action) {
        action.source.model.changeTabPosition(action.data.tabId,
            action.data.newPosition);
    }

    processToggleBoxAction(action) {
        action.source.model.toggle();
    }

    processOpenAllTabsAction(action) {
        let urls = $.map(action.source.model.getTabs(), tab => tab.url);
        TabUtils.createTabsIfDoNotExist(urls);
    }

    processCloseAllTabsAction(action) {
        let urls = $.map(action.source.model.getTabs(), tab => tab.url);
        TabUtils.closeTabsByUrls(urls);
    }
}