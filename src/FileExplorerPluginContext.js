var path = require('path');

module.exports = class FileExplorerPluginContext {
    constructor(builder) {
        this.widgetArea = require('./WidgetArea');
        this.dirLoader = builder.dirLoader;
        this.fileExplorer = builder.fileExplorer;
        this.templEngine = builder.templEngine;
        this.widgets = [];
        this.scripts = [];
        this.styles = [];
        this.builders = [];
        this.contentGenerators = [];
        this.templateFiles = [];
    }
    static get Builder() {
        class Builder {
            addFileExplorer(fileExplorer) {
                if(fileExplorer == null) {
                    console.log("WARNING - added null server.");
                }
                this.fileExplorer = fileExplorer;
                return this;
            }
            addDirLoader(dirLoader) {
                if(dirLoader == null) {
                    console.log("WARNING - added null directory loader.");
                }
                this.dirLoader = dirLoader;
                return this;
            }
            addTemplEngine(templEngine) {
                if(templEngine == null) {
                    console.log("WARNING - added null template engine.");
                }
                this.templEngine = templEngine;
                return this;
            }
            build() {
                return new FileExplorerPluginContext(this);
            }
        }

        return new Builder();
    }    

    /**
     * Registers a new widget. A widget is a custom html code which will be rendered in the given widget area.
     * As widget area a field of this.widgetArea must be passed.
     * @param { htmlString, widgetArea } widget
     */
    registerWidget(widget) {
        this.widgets.push(widget);
    }

    /**
     * Registers a new script, which will be rendered in head - part of result html.
     * @param {path} script 
     */
    registerUiScript(script) {
        script.path = script.path;
        this.scripts.push(script);

    }

    /**
     * Registers a new stylesheet, which will be rendered in head - part of result html.
     * @param {path} style 
     */
    registerStyle(style) {
        style.path = style.path;
        this.styles.push(style);
    }

    /**
     * Registers a new content generator which will be executed during routing in application.
     * The given generator must be an object with a function named "contentGeneratorMethod" with a "path" attribute.
     * @param {*} generator 
     */
    registerContentGenerator(generator) {
        this.contentGenerators.push(generator);
    }

    /**
     * Registers a new template file, which will be loaded by template engine.
     * The file will be available with the given key.
     * @param {*} file 
     * @param {*} key
     */
    registerTemplate(file, key) {
        this.templateFiles.push({
            file: file,
            key: key
        });
    }

    /**
     * Registers a new response builder which can add custom fields to the response object which is used by response generation.
     * The added fields can be used by templates.
     * The given object must have a function named "addResponseFields" with the "response" attribute.
     * @param {*} obj 
     */
    registerResponseBuilder(obj) {
        this.builders.push(obj);
    }
}