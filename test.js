var expect = require('chai').expect;
var fs = require('fs');
var buildGroups = require('./index.js');
var htmlParseTree = require('html-parse-tree');

describe('build-groups', function() {

    it('finds groups', function(done) {
        var html = fs.readFileSync('test.html', 'utf-8');

        htmlParseTree(html, function(err, tree) {
            buildGroups(tree, function(err, groups) {
                expect(groups).to.have.length(2);

                expect(groups[0]).to.have.property('type', 'js');
                expect(groups[0]).to.have.property('name', 'js/app.js');
                expect(groups[0].files).to.have.length(4);

                expect(groups[1]).to.have.property('type', 'css');
                expect(groups[1]).to.have.property('name', 'test/style.css');
                expect(groups[1].files).to.have.length(2);

                done();
            });
        });

    });

});
