class BoxView extends ListView {

    constructor(model, mvcResolver) {
        super(model, model.getTabs(), mvcResolver);
    }

    getHtml() {
        let html = HtmlTemplateUtils.generateBoxHtml(this.model);
        this.items.forEach(item => {
            html = this._addItemToHtml(item, html);
        });

        return this._syncHtmlWithModel(html);
    }

    getElement() {
        return $("#box-" + this.id);
    }

    init() {
        this.model.addListener(event => this._updateView(event));

        this._addAddTabAction();
        this._addRenameBoxAction();
        this._addExpandBoxAction();
        this._addCollapseBoxAction();
        this._addToggleBoxAction();
        this._addRemoveBoxAction();
        this._addOpenAllTabsAction();
        this._addCloseAllTabsAction();

        this.items.forEach(item => item.init());
        this._initDragAndDrop();
        this._initToolBar();
    }

    filterItems(filterQuery) {
        if (filterQuery) {
            this._hideItems();
            let filteredTabs = this.model.filterTabs(filterQuery);
            let filteredTabIds = $.map(filteredTabs, box => box.id);
            this._showItems(filteredTabIds)
        } else {
            this._showItems();
        }
    }

    _initDragAndDrop() {
        sortable('#box-content-' + this.id, {
            handle: '.tab-title',
            // connectWith: 'connected',
            forcePlaceholderSize: true
        });

        sortable('#box-content-' + this.id)[0].addEventListener('sortupdate',
            event => {
                let tabId = event.detail.item.id.substr(4);
                this._notifyListeners("boxView/tabPositionChangedAction", {
                    tabId: tabId,
                    newPosition: event.detail.index
                });
                // if (e.detail.startparent === e.detail.endparent) {
                //     var boxId = $("#" + e.detail.endparent.id).parent().attr('id');
                //     var tabId = e.detail.item.id.substr(4);
                //     boxes.changeTabPosition(boxId, tabId, e.detail.index)
                // } else {
                //     var oldBoxId = $("#" + e.detail.startparent.id).parent().attr('id');
                //     var newBoxId = $("#" + e.detail.endparent.id).parent().attr('id');
                //     var tabIdToMove = e.detail.item.id.substr(4);
                //     boxes.moveTabToBox(oldBoxId, newBoxId, tabIdToMove, e.detail.index)
                // }
            });
    }

    _initToolBar() {
        $("#toolbar-" + this.model.id).hover(() => {
            $("#open-all-tabs-button-" + this.model.id).removeClass("d-none");
            $("#close-all-tabs-button-" + this.model.id).removeClass("d-none");
            $("#rename-box-button-" + this.model.id).removeClass("d-none");
            $("#remove-box-button-" + this.model.id).removeClass("d-none");
        }, () => {
            $("#open-all-tabs-button-" + this.model.id).addClass("d-none");
            $("#close-all-tabs-button-" + this.model.id).addClass("d-none");
            $("#rename-box-button-" + this.model.id).addClass("d-none");
            $("#remove-box-button-" + this.model.id).addClass("d-none");
        });
    }

    _syncHtmlWithModel(html) {
        let dom = HtmlUtils.htmlToDom(html);
        if (this.model.showContent) {
            dom.find("#box-content-" + this.id)
                .removeClass('collapse')
                .addClass('show');
            dom.find("#collapse-box-icon-" + this.id)
                .removeClass("fa-chevron-down")
                .addClass("fa-chevron-up");
        }
        return dom.html();
    }

    _addItem(itemModel) {
        let item = super._addItem(itemModel);
        if (item) {
            item.addListener(
                event =>
                    this._notifyListeners("boxView/removeTabAction", event.source),
                "tabView/removeTabAction");
        }
        return item;
    }

    _updateView(event) {
        switch (event.type) {
            case "tabAdded": {
                let item = this._addItem(event.data);
                this._addItemToHtml(item);
                item.init();
                break;
            }
            case "tabRemoved": {
                let item = this._removeItem(event.data);
                item.remove();
                break;
            }
            case "nameChanged":
                $("#switch-to-box-" + this.id).text(event.data);
                break;
            case "boxExpanded":
                this.expand();
                break;
            case "boxCollapsed":
                this.collapse();
                break;
            case "tabsCountChanged":
                this._updateTabsCount(event.data);
                break;
        }
    }

    expand() {
        $("#box-content-" + this.id)
            .removeClass('collapse')
            .addClass('show');
        $("#collapse-box-icon-" + this.id)
            .removeClass("fa-chevron-down")
            .addClass("fa-chevron-up");
    }

    collapse() {
        $("#box-content-" + this.id)
            .removeClass('show')
            .addClass('collapse');
        $("#collapse-box-icon-" + this.id)
            .removeClass("fa-chevron-up")
            .addClass("fa-chevron-down");
    }

    _updateTabsCount(tabsCount) {
        $("#box-tabs-count-" + this.id)
            .text("[ " + tabsCount + " ]");
    }


    _addItemToHtml(item, html) {
        let dom = html ? HtmlUtils.htmlToDom(html) : $('body');
        dom.find("#box-content-" + this.id).append(item.getHtml());
        return dom.html();
    }

    _addAddTabAction() {
        $("#boxes").on("click", "#add-to-box-button-" + this.id, () =>
            this._notifyListeners("boxView/addTabAction"));
    }

    _addRenameBoxAction() {
        $("#boxes").on("click", "#rename-box-button-" + this.id, () =>
            this._notifyListeners("boxView/renameBoxAction"));
    }

    _addExpandBoxAction() {
        $("#box-content-" + this.model.id).on("show.bs.collapse", () =>
            this._notifyListeners("boxView/expandBoxAction"));
    }

    _addCollapseBoxAction() {
        $("#box-content-" + this.model.id).on("hide.bs.collapse", () =>
            this._notifyListeners("boxView/collapseBoxAction"));
    }

    _addRemoveBoxAction() {
        $("#boxes").on("click", "#remove-box-button-" + this.id, () => {
            this._notifyListeners("boxView/removeBoxAction")
        });
    }

    _addToggleBoxAction() {
        $("#boxes").on("click", "#box-name-" + this.id, () => {
            this._notifyListeners("boxView/toggleBoxAction")
        });
    }

    _addOpenAllTabsAction() {
        $("#boxes").on("click", "#open-all-tabs-button-" + this.id, () =>
            this._notifyListeners("boxView/openAllTabsAction"));
    }

    _addCloseAllTabsAction() {
        $("#boxes").on("click", "#close-all-tabs-button-" + this.id, () =>
            this._notifyListeners("boxView/closeAllTabsAction"));
    }
}