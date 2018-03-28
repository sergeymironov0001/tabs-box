class HtmlTemplateUtils {

    static generateBoxHtml(box) {
        return Mustache.to_html(HtmlTemplateUtils.boxHtmlTemplate, box);
    }

    static generateTabHtml(tab) {
        return Mustache.to_html(HtmlTemplateUtils.tabHtmlTemplate, tab);
    }
}

Templates.loadPopupBoxTemplate(function (template) {
    HtmlTemplateUtils.boxHtmlTemplate = template;
});

Templates.loadPopupTabTemplate(function (template) {
    HtmlTemplateUtils.tabHtmlTemplate = template;
});
