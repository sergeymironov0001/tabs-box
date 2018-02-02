class BoxesView extends View {

    constructor(boxes) {
        super();

        this.boxes = boxes;

        var self = this;
        this.subViewEventListener = function (boxView, type) {
            console.log("Delete box");
            if (type === 'delete') {
                self.__deleteSubView(boxView);
                self.boxes.removeBox(boxView.box);
            }
        };

        this.boxViews = [];
        this.__createSubViews(boxes.getBoxes())
            .forEach(function (view) {
                self.__addSubView(view);
            });
    }

    __getSubViews() {
        return this.boxViews;
    }

    __createSubView(box) {
        return new BoxView(this.boxes, box);
    }

    __outputSubView(boxView) {
        boxView.outputView($('#boxes'));
        if (boxView.box.showContent) {
            boxView.expand();
        }
    }

    __createNewEmptyBox() {
        var box = this.boxes.addNewBox();
        var boxView = this.__createSubView(box);
        this.__addSubView(boxView);
        this.__outputSubView(boxView);
    }

    __putCurrentTabToNewBox() {
        var self = this;
        var box = this.boxes.addNewBox();
        Tabs.getCurrentTab(function (activeTab) {
            Tabs.getCurrentTabPicture(function (snapshotImageUrl) {
                var tab = new Tab(null, activeTab, snapshotImageUrl);
                if (!self.boxes.putTabToBox(box.id, tab)) {
                    return;
                }
                self.boxes.showBoxContent(box.id);
                self.__createAddAndOutputSubView(box);
            });
        });
    }

    __addButtonsListeners() {
        var self = this;
        $('#crete-empty-tab-box-button').click(function (e) {
            self.__createNewEmptyBox();
        });
        $('#put-tab-to-new-box-button').click(function (e) {
            self.__putCurrentTabToNewBox();
        });
        $('#open-options-button').click(function (e) {
            Tabs.selectOptionsTab();
        });
    }
}