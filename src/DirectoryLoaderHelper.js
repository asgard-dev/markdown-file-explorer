var path = require('path');
var BreakException = {};
var NotFoundException = {
    reason: "NOT_FOUND"
};

module.exports = class DirectoryLoaderHelper {

    static get REFRESH_TIMEOUT() {
        return 5 * 60 * 1000;
    }

    static scheduleNextParse(dirLoader, rootPath) {
        setTimeout(function () {
            dirLoader.parseDir(rootPath);
        }, DirectoryLoaderHelper.REFRESH_TIMEOUT);
        console.log("INFO - state refreshed.");
    }

    static doRecursive(element, method) {
        element.files.forEach(function (file) {
            method(file);
            if (file.files !== null) {
                DirectoryLoaderHelper.doRecursive(file, method);
            }
        });
    }

    static get(struct, key) {
        var value = undefined;

        try {
            struct.files.forEach(function (file) {
                if (file.name === key) {
                    value = file;
                    throw BreakException;
                }
            });
        } catch (e) {
            if (e !== BreakException) throw e;
        }

        if (value === undefined) {
            console.log("WARNING! Requested key did not found: " + key);
            throw NotFoundException;
        } else {
            return value;
        }
    }

    static parseName(rootPath) {
        return path.basename(rootPath);
    }

    static compareDirectory(a, b) {
        if (a.files !== null && b.files === null) {
            return -1;
        } else if (b.files !== null && a.files === null) {
            return 1;
        } else {
            return a.name - b.name;
        }
    }
};