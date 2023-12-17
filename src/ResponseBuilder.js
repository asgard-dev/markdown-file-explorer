var marked = require('marked');
var widgetArea = require('./WidgetArea');

class ResponseBuilder {
    init(dirLoader) {
        this.response = {};
        this.dirLoader = dirLoader;
        this.templEngine = require('./TemplateEngine');
        this.ErrorHandler = require('./ErrorHandler');
        this.contentGenFactory = require('./ContentGeneratorFactory');
        this.marked = marked;
        this.templEngine.init('paste');
        this.contentGenFactory.init(this.templEngine);
        this.executeMarkedHacks();
    }

    /** 
     * Rendering of table is changed so bootstrap will render it with borders.
    */
    executeMarkedHacks() {
        marked.Renderer.prototype.table = function(header, body) {
            return '<table class="table">\n'
              + '<thead>\n'
              + header
              + '</thead>\n'
              + '<tbody>\n'
              + body
              + '</tbody>\n'
              + '</table>\n';
          };
	marked.Renderer.prototype.image = function(href, title, text) {
	  if (this.options.baseUrl && !originIndependentUrl.test(href)) {
	    href = resolveUrl(this.options.baseUrl, href);
	  }
	  var out = '<img class="img-responsive" src="' + href + '" alt="' + text + '"';
	  if (title) {
	    out += ' title="' + title + '"';
	  }
	  out += this.options.xhtml ? '/>' : '>';
	  return out;
	};
    }
    /** 
     * This should be called when a http request arrives. 
     */
    reset() {
        this.dirLoader.reset();
        return this;
    }

    /** 
     * Adds site name to the response object.
     */
    addName() {
        this.response.name = this.dirLoader.getMarkdownStructure().name;
        return this;
    }
    /**
     * Adds the content-part of site. Normally this a parsed markdown file, but also can be error message.
     * @param {*} path - the path-part of URL.
     */
    addContent(path) {
        var generator = this.contentGenFactory.getContentGenerator(path, this.dirLoader);
        this.response.content = marked(generator.generateContent());
        return this;
    }

    addNotFoundContent() {
        this.response.content = marked(this.ErrorHandler.getNotFoundContent(this.dirLoader));
        return this;
    }

    /** 
     * Adds the copyright information to the response object.
     * The information can be declared in `COPYRIGHT.md` user template.
     */
    addCopyRight() {
        var copy = "";
        try {
            var copy_raw = this.dirLoader.getUserTemplate("COPYRIGHT.md");
            copy = this.marked(copy_raw.content);
        } catch (e) {
            console.log("WARNING - copyright information was not found or could not be parsed!");
            console.log(e);
        }

        this.response.copyright = copy;
        return this;
    }

    /** 
     * Renders widgets.
     */
    addWidgets() {
        this.response.widgets_lmt = "";
        for (var i = 0; i < this.widgets.length; i++) {
            var widget = this.widgets[i];
            if (widget.widgetArea == widgetArea.LEFT_MAIN_TOP) {
                this.response.widgets_lmt += " " + widget.htmlString;
            }
        }
        return this;
    }

    addPluginData() {
        for(var i = 0; i<this.builders.length; i++) {
            console.log("DEBUG - request plugin to add data...");
            this.builders[i].addResponseFields(this.response);
        }
        return this;
    }

    addStyles() {
        this.response.styles = this.styles;
        return this;
    }

    addScripts() {
        this.response.scripts = this.scripts;
        return this;
    }

    /** 
     * Adds the left part of the screen (explorer menu).
     */
    addExplorer() {
        this.response.explorer = this.templEngine.renderExplorer(this.dirLoader.getMarkdownStructure());
        return this;
    }

    /** 
     * Renders the response object to HTML source and returns it.
     */
    toHtml() {
        return this.templEngine.renderMain(this.response);
    }

    /**
     * Plugin methods are registered here.
     */

    registerWidgets(widgets) {
        this.widgets = widgets;
    }

    registerScripts(scripts) {
        this.scripts = scripts;
    }

    registerStyles(styles) {
        this.styles = styles;
    }

    registerResponseBuilders(builders) {
        this.builders = builders;
    }

    registerContentGenerators(contentGenerators) {
        this.contentGenFactory.registerPlugins(contentGenerators);
    }
};

module.exports = new ResponseBuilder();
