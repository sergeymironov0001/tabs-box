class MVCResolver {

    constructor() {
        this.tabController = new TabController();
        this.boxController = new BoxController();
        this.boxesManagerController = new BoxesManagerController();
    }

    createView(model) {
        let view;
        if (model instanceof Tab) view = new TabView(model);
        if (model instanceof Box) view = new BoxView(model, this);
        if (model instanceof BoxesManager) view = new BoxesManagerView(model, this);

        view.addListener(action => this.actionsResolver(action));
        return view;
    }

    actionsResolver(action) {
        // console.log(action);

        switch (action.type) {
            case "tabView/selectTabAction":
                this.tabController.processSelectTabAction(action);
                break;
            case "tabView/editTabAction":
                this.tabController.processEditTabAction(action);
                break;
            case "boxView/removeTabAction":
                this.boxController.processRemoveTabAction(action);
                break;
            case "boxView/addTabAction":
                this.boxController.processAddTabAction(action);
                break;
            case "boxView/renameBoxAction":
                this.boxController.processRenameBoxAction(action);
                break;
            case "boxView/expandBoxAction":
                this.boxController.processExpandBoxAction(action);
                break;
            case "boxView/collapseBoxAction":
                this.boxController.processCollapseBoxAction(action);
                break;
            case "boxView/tabPositionChangedAction":
                this.boxController.processTabPositionChangedAction(action);
                break;
            case "boxesManagerView/addBoxAction":
                this.boxesManagerController.processAddBoxAction(action);
                break;
            case "boxesManagerView/addEmptyBoxAction":
                this.boxesManagerController.processAddEmptyBoxAction(action);
                break;
            case "boxesManagerView/removeBoxAction":
                this.boxesManagerController.processRemoveBoxesAction(action);
                break;
            // case "boxesManagerView/filterBoxesAction":
            //     this.boxesManagerController.processFilterBoxesAction(action);
            //     break;
            case "boxManagerView/boxPositionChangedAction":
                this.boxesManagerController.processBoxPositionChangedAction(action);
                break;
        }
    }
}