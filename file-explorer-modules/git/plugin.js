var GIT_RELOAD_PATH = "/git_reload/";
var path = require('path');

class Git {
    init(fileExplorerPluginContext) {
        
        this.reload(fileExplorerPluginContext);
        
        fileExplorerPluginContext.registerWidget({
            htmlString : this.getUiHtml(), 
            widgetArea : fileExplorerPluginContext.widgetArea.LEFT_MAIN_TOP
        });

        fileExplorerPluginContext.registerResponseBuilder(this);

        fileExplorerPluginContext.registerUiScript({
            path: path.join('git', 'resources', 'script.ui.js')
        });

        fileExplorerPluginContext.registerContentGenerator(this);
    }

    getUiHtml() {
        return "<a title=\"Click here to refresh immediately.\" onclick=\"refresh();\" style=\"margin: -20px 40px 30px 40px; color: #000; cursor: pointer; display: block;\">" + 
                    "<img src=\"/file-explorer-modules/git/resources/git.png\" style=\"height: 20px;\"> " + 
                    "Last refreshed: {{lastRefreshTime}}" + 
                "</a>";
    }

    reload(fileExplorerPluginContext) {
        this.templEngine = fileExplorerPluginContext.templEngine;
        this.dirLoader = fileExplorerPluginContext.dirLoader;
        console.log("INFO - Git plugin reloaded.");
    }

    addResponseFields(response) {
        response.lastRefreshTime = this.parseTime(this.dirLoader.lastReload);
    }

    parseTime(time) {
        return this.addZero(time.getHours()) + ":" + this.addZero(time.getMinutes());
    }

    addZero(digit) {
        if(digit < 10) {
            return "0" + digit;
        } else {
            return "" + digit;
        }
    }

    contentGeneratorMethod(path) {
        if (path.startsWith(GIT_RELOAD_PATH)) {
            this.dirLoader.parseDir(this.dirLoader.rootPath, false);
            return {
                generateContent: function() {
                    return "# Git repository pulled successfully.\nHowever, this URL should be called only with AJAX request.";
                }
            };
        } else {
            return null;
        }
    }
}

module.exports = new Git();