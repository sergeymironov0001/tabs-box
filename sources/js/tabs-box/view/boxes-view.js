class BoxesView extends View {

    constructor(boxes) {
        super();

        this.boxes = boxes;

        var self = this;
        this.subViewEventListener = function (boxView, type) {
            if (type === 'delete') {
                self.__deleteSubView(boxView);
                this.boxes.removeBox(boxView.box);
            }
        };

        this.boxViews = this.__createSubViews(boxes.getBoxes());
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

    __addButtonsListeners() {
        // child has to implement this
    }
}