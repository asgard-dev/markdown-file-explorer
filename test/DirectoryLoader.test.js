'use strict';

var assert = require('assert');
var dl = require('../src/DirectoryLoader');

describe('DirectoryLoader', function() {
    describe('#init()', function(){
        it('should contain server', function() {
            dl.init({test: "test"});
            assert.notEqual(dl.server, undefined);
            assert.notEqual(dl.server, null);
        });
    });
});

