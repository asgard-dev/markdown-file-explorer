var fs = require('fs');
var path = require('path');
var BreakException = {};
var NotFoundException = {
    reason: "NOT_FOUND"
};
var DirectoryLoaderHelper = require('./DirectoryLoaderHelper');

class DirectoryLoader {

    init(server) {
        this.server = server;
    }

    parseDir(rootPath) {
        this.parseDir(rootPath, true);
    }
    /**
     * This is the main method which reads the given root directory and parse it.
     * @param {*} rootPath 
     */
    parseDir(rootPath, scheduleNextParse) {
        this.rootPath = rootPath;
        this.handleGitRepo();
        this.markdownStructure = {
            name: DirectoryLoaderHelper.parseName(this.rootPath), // used as page title
            files: this.discover(this.rootPath, "", []) // the actual structure
        };
        this.parseComplete(scheduleNextParse);
    }

    parseComplete(scheduleNextParse) {
        this.server.directoryReloaded();
        this.lastReload = new Date();
        if(scheduleNextParse) {
            DirectoryLoaderHelper.scheduleNextParse(this, this.rootPath);
        }
    }

    handleGitRepo() {
        if (this.isGitRepo) {
            try {
                require('simple-git')(this.rootPath).pull(function () {
                    console.log("INFO - Successfully pulled git repo.");
                });
            } catch (e) {
                console.log("WARNING - error during git repo pull: " + e);
            }
        }
    }

    /**
     * This method can discover the given directory recoursively.
     * @param {*} dir - a string returned by path.join() method 
     * @param {*} rel - relative url to served root directory
     * @param {name, path, content, files} mdStruct - the structure to fill
     */
    discover(dir, rel, mdStruct) {
        var mdStruct = mdStruct || [];
        var files = fs.readdirSync(dir);
        var dirLoader = this;

        files.forEach(function (file) {
            if (fs.statSync(path.join(dir, file)).isDirectory()) {
                if (file === ".file-explorer") {
                    console.log("INFO - user-defined templates found!");
                    dirLoader.templateDir = {
                        files: dirLoader.discover(path.join(dir, file), rel + "/" + file, [])
                    };
                } else if (file === ".git") {
                    dirLoader.isGitRepo = true;
                } else {
                    mdStruct.push({
                        name: file,
                        path: null,
                        content: null,
                        files: dirLoader.discover(path.join(dir, file), rel + "/" + file, [])
                    });
                    if (mdStruct[mdStruct.length - 1].files.length === 0) {
                        mdStruct.splice(mdStruct.length - 1, 1);
                    }
                }
            } else {
                if (file.match(/\.(md|txt|markdown)$/i)) {
                    mdStruct.push({
                        name: file,
                        path: rel + "/" + file,
                        content: fs.readFileSync(path.join(dir, file), 'utf8'),
                        files: null
                    });
                }
            }
        });

        return mdStruct.sort(DirectoryLoaderHelper.compareDirectory);
    }

    getMarkdownStructure() {
        return this.markdownStructure;
    }

    /** 
     * Return only files (not directories)
    */
    getLeafArray() {
        var array = [];
        DirectoryLoaderHelper.doRecursive(this.markdownStructure, function (file) {
            if (file.files === null) {
                array.push(file);
            }
        });

        return array;
    }

    /**
     * Returns an element of this.markdownStructure specified by url string.
     * Also sets isSelected and isSelectedParent attributes of nodes on the way.
     * @param {*} path 
     */
    getContent(path) {
        var levels = path.split("/");
        var content_i = this.markdownStructure;
        for (var i = 0; i < levels.length; i++) {
            content_i = DirectoryLoaderHelper.get(content_i, decodeURIComponent(levels[i]));
            content_i.isSelectedParent = true;
        }
        content_i.isSelectedParent = false;
        content_i.isSelected = true;
        return content_i.content;
    }

    /** 
     * This is called when the processing of a new request started.
     * Resets the request-specific state of this object.
    */
    reset() {
        this.resetSelectedState();
    }

    resetSelectedState() {
        DirectoryLoaderHelper.doRecursive(this.markdownStructure, function (file) {
            file.isSelected = false;
            file.isSelectedParent = false;
        })
    }

    getUserTemplate(key) {
        return DirectoryLoaderHelper.get(this.templateDir, key);
    }
};

module.exports = new DirectoryLoader();