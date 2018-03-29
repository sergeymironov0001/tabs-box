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

    processRemoveBoxesAction(action) {
        action.source.model.removeBox(action.data.model.id);
    }

    processOpenOptionsAction(action) {
        TabUtils.selectOptionsTab();
    }

    // processFilterBoxesAction(action) {
    //     let boxes = action.source.model.searchBoxesByTabs(action.data);
    //     console.log(boxes);
    // }

    processBoxPositionChangedAction(action) {
        action.source.model.changeBoxPosition(action.data.boxId,
            action.data.newPosition);
    }
}