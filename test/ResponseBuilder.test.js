'use strict';

var assert = require('assert');
var rb = require('../src/ResponseBuilder');

describe('ResponseBuilder', function() {
    describe('#init()', function(){
        it('should contain template engine', function() {
            rb.init();
            assert.notEqual(rb.templEngine, undefined);
            assert.notEqual(rb.templEngine, null);
        });
    });
});

describe('ResponseBuilder', function() {
    describe('#addName()', function(){
        it('should return response with name', function() {
            rb.dirLoader = generateMockDirLoader();

            rb.addName();
            assert.notEqual(rb.response.name, undefined);
            assert.notEqual(rb.response.name, null);
        });
    });
});

describe('ResponseBuilder', function() {
    describe('#addContent()', function(){
        it('should return response with content', function() {
            rb.contentGenFactory = generateMockContentGenFactory();
            
            rb.addContent();
            assert.notEqual(rb.response.content, undefined);
            assert.notEqual(rb.response.content, null);
        });
    });
});

describe('ResponseBuilder', function() {
    describe('#addNotFoundContent()', function(){
        it('should return response with content', function() {
            
            rb.addNotFoundContent();
            assert.notEqual(rb.response.content, undefined);
            assert.notEqual(rb.response.content, null);
        });
    });
});

describe('ResponseBuilder', function() {
    describe('#addCopyRight()', function(){
        it('should return response with copyright', function() {
            
            rb.addCopyRight();
            assert.notEqual(rb.response.copyright, undefined);
            assert.notEqual(rb.response.copyright, null);
        });
    });
});

describe('ResponseBuilder', function() {
    describe('#addExplorer()', function(){
        it('should return response with explorer', function() {
            
            rb.addExplorer();
            assert.notEqual(rb.response.explorer, undefined);
            assert.notEqual(rb.response.explorer, null);
        });
    });
});

describe('ResponseBuilder', function() {
    describe('#toHtml()', function(){
        it('should return response in HTML format', function() {
            var resp = rb.toHtml();
            assert.notEqual(resp, undefined);
            assert.notEqual(resp, null);
        });
    });
});

function generateMockDirLoader() {
    return {
        getMarkdownStructure() {
            return { name: "TestName" };
        }
    }
}

function generateMockContentGenFactory() {
    return {
        getContentGenerator(path, dirLoader) {
            return {
                generateContent: function() {
                    return "TestContent";
                }
            };
        }
    }
}