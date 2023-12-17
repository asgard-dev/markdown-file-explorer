class SearchContentGenerator {
    init(dirLoader, searchEngine, templEngine, path, templateKey) {
        this.dirLoader = dirLoader;
        this.searchEngine = searchEngine;
        this.templEngine = templEngine;
        this.path = path;
        this.templateKey = templateKey;
        return this;
    }

    generateContent() {
        var query = decodeURIComponent(this.path);
        if(query.trim().length <= 2) {
            return "You should specify a longer search query!";
        } else {
            var results = this.searchEngine.doSearch(this.dirLoader.getLeafArray(), query);
            return this.templEngine.abstractRender(this.templateKey, { query: query, results: results });
        }        
    }
}

module.exports = new SearchContentGenerator();