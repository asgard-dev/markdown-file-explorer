var marked = require('marked');
var EMPTY_STRING = "";
var EMPTY_PATH = "/";

class ContentGeneratorFactory {
    init(templateEngine) {
        this.defaultContentGenerator = require('./DefaultContentGenerator');
        this.basicContentGenerator = require('./BasicContentGenerator');
        this.templEngine = templateEngine;
    }

    registerPlugins(plugins) {
        this.plugins = plugins;
    }

    getContentGenerator(path, dirLoader) {
        var ret = this.executePlugins(path);

        if (ret !== null) {
            return ret;
        } else if (path === EMPTY_PATH || path === EMPTY_STRING) {
            return this.defaultContentGenerator.init(dirLoader);
        } else if (path.startsWith(EMPTY_PATH)) {
            return this.basicContentGenerator.init(dirLoader, path.substr(EMPTY_PATH.length));
        } else {
            return this.defaultContentGenerator.init(dirLoader);
        }
    }

    executePlugins(path) {
        for (var i = 0; i < this.plugins.length; i++) {
            try {
                var ret = this.plugins[i].contentGeneratorMethod(path);
                if (ret !== null) {
                    return ret;
                }
            } catch (e) {
                console.log("WARNING - content generator plugin failed! Further details:");
                console.log(e);
            }
        }

        return null;
    }
}

module.exports = new ContentGeneratorFactory();