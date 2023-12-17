class DefaultContentGenerator {
    init(dirLoader) {
        this.dirLoader = dirLoader;
        this.ErrorHandler = require('./ErrorHandler');
        return this;
    }

    generateContent() {
        return this.ErrorHandler.getDefaultContent(this.dirLoader);
    }
}

module.exports = new DefaultContentGenerator();