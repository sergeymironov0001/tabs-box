class HtmlTemplateUtils {

    static generateBoxHtml(box) {
        return Mustache.to_html(HtmlTemplateUtils.boxHtmlTemplate, box);
    }

    static generateTabHtml(tab) {
        return Mustache.to_html(HtmlTemplateUtils.tabHtmlTemplate, tab);
    }

    static generateThemesHtml(themes) {
        return Mustache.to_html(HtmlTemplateUtils.themesHtmlTemplate, themes);
    }
}

Templates.loadPopupBoxTemplate(template => {
    HtmlTemplateUtils.boxHtmlTemplate = template;
});

Templates.loadPopupTabTemplate(template => {
    HtmlTemplateUtils.tabHtmlTemplate = template;
});

Templates.loadThemesTemplate(template => {
    HtmlTemplateUtils.themesHtmlTemplate = template;
});

