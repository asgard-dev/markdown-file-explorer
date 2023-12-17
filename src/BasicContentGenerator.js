class BasicContentGenerator {
    init(dirLoader, path) {
        this.dirLoader = dirLoader;
        this.ErrorHandler = require('./ErrorHandler');
        this.path = path;
        return this;
    }

    generateContent() {
        var content = this.dirLoader.getContent(this.path);
        if (content === undefined || content === null) {
            return this.ErrorHandler.getEmptyContent(this.dirLoader);
        }
        return content;
    }
}

module.exports = new BasicContentGenerator();