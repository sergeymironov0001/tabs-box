class HtmlUtils {

    static htmlToDom(html) {
        return $("<div>" + html + "</div>");
    }
}