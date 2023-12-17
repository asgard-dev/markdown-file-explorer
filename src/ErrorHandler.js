module.exports = class ErrorHandler {
    static getNotFoundContent(dirLoader) {
        var userDefinedContent = "# This content was not found.\n\nFor further information, contact the administrator.";

        try {
            userDefinedContent = dirLoader.getUserTemplate("NOTFOUND.md");
            return userDefinedContent.content;
        } catch (e) {}

        return userDefinedContent;
    }
    static getEmptyContent(dirLoader) {
        var userDefinedContent = "# This content is empty.\n\nFor further information, contact the administrator.";

        try {
            userDefinedContent = dirLoader.getUserTemplate("EMPTY.md");
            return userDefinedContent.content;
        } catch (e) {}

        return userDefinedContent;
    }
    static getDefaultContent(dirLoader) {
        var userDefinedContent = "# Welcome!";

        try {
            userDefinedContent = dirLoader.getUserTemplate("HOME.md");
            return userDefinedContent.content;
        } catch (e) {}

        return userDefinedContent;
    }
};