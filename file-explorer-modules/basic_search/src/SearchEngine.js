var NO_RESULTS = -1;

/** 
 * Very simple search implementation:
 *  - Orders results by match count desc.
 *  - It can find only non-case-sensitive full matches
 *  - It can display only the first match in a given file.
 */
class SearchEngine {
    doSearch(mdArray, query) {
        var resultArray = [];
        var regex = new RegExp(query, "ig")

        for (var i = 0; i < mdArray.length; i++) {
            var file = mdArray[i];
            var at = file.content.search(regex);
            if (at !== NO_RESULTS) {
                var relevance = file.content.match(regex).length;
                resultArray.push(this.createResultObject(file, query, at, relevance));
            }
        }

        return resultArray.sort(this.compareResults);
    }

    createResultObject(file, query, at, relevance) {
        return {
            name: this.calculateName(file, query),
            path: file.path,
            relevance: relevance,
            content: this.calculateContent(file, query, at)
        };
    }

    calculateName(file, query) {
        var dotPos = file.name.lastIndexOf(".");
        var printableName = file.name.substring(0, dotPos);
        return printableName.replace(query, "<span class=\"match\">" + query + "</span>");
    }

    calculateContent(file, query, at) {
        var lineStart = this.getLineStart(file.content, at);
        var lineEnd = this.getLineEnd(file.content, at);
        var line = file.content.substring(lineStart, lineEnd);
        return line.replace(query, "<span class=\"match\">" + query + "</span>");
    }

    getLineStart(text, pos) {
        var textBefore = text.substring(0, pos);
        return textBefore.lastIndexOf("\n");
    }

    getLineEnd(text, pos) {
        var textAfter = text.substring(pos);
        return textAfter.search("\n") + pos;
    }

    /**
     * Orders results by relevance DESC
     * @param {relevance, *} a 
     * @param {relevance, *} b 
     */
    compareResults(a, b) {
        return b.relevance - a.relevance;
    }
}

module.exports = new SearchEngine();