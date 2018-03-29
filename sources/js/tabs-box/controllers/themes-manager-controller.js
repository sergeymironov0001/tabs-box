class ThemesManagerController extends Controller {

    constructor() {
        super();
    }

    processChangeThemeAction(action) {
        action.source.model.applyTheme(action.data);
    }
}