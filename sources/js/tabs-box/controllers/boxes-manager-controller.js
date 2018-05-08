class BoxesManagerController extends Controller {

    constructor() {
        super();
    }

    processAddBoxAction(action) {
        let newBox = action.source.model.addBox();
        TabUtils.getCurrentTab(tabInfo => {
            newBox.addTab({
                title: tabInfo.title,
                url: tabInfo.url,
                favIconUrl: tabInfo.favIconUrl
            });
        });
    }

    processAddEmptyBoxAction(action) {
        action.source.model.addBox();
    }

    processPutOpenedTabsToNewBoxAction(action) {
        let newBox = action.source.model.addBox();
        TabUtils.getCurrentWindowTabs(tabs => {
            tabs = tabs || [];
            tabs.forEach(tabInfo => {
                newBox.addTab({
                    title: tabInfo.title,
                    url: tabInfo.url,
                    favIconUrl: tabInfo.favIconUrl
                });
            });
        });
    }

    processRemoveBoxesAction(action) {
        ModalDialogFactory.createDialog('confirmBoxRemove', action.data.model,
            removingBox => action.source.model.removeBox(removingBox.id)
        ).show();
    }

    processOpenOptionsAction(action) {
        TabUtils.selectOptionsTab();
    }

    // processFilterBoxesAction(action) {
    //     let boxes = action.source.model.searchBoxesByTabs(action.data);
    //     console.log(boxes);
    // }

    processBoxPositionChangedAction(action) {
        action.source.model.changeBoxPosition(
            action.data.boxId,
            action.data.newPosition);
    }

    processCollapseAllBoxes(action) {
        action.source.model.collapseBoxes();
    }

    processExpandAllBoxes(action) {
        action.source.model.expandBoxes();
    }

    processTabMovedAction(action) {
        action.source.model.moveTab(
            action.data.tabId,
            action.data.oldBoxId,
            action.data.newBoxId,
            action.data.tabPosition);
    }
}