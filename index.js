var parseTree = require('html-parse-tree');
var _ = require('lodash');

module.exports = function(html, callback) {
    parseTree(html, function(err, tree) {
        if (err) callback(err);
        callback(null, buildGroups(tree));
    });
};

function buildGroups(tree) {
    return findGroups(tree, []);
}

function findGroups(items, groups) {
    var current = null;

    _.each(items, function(item) {
        if (item.type === 'comment') {
            if (isEndBuild(item.data)) {
                if (current) {
                    groups.push(current);
                    current = null;
                }
            } else {
                var info = buildInfo(item.data);
                if (info) current = info;
            }
        } else if (item.type === 'tag') {
            if (current && item.name === 'script') {
                current.files.push(item.attrs.src);
            } else if (current && item.name === 'link') {
                current.files.push(item.attrs.href);
            } else {
                findGroups(item.children, groups)
            }
        }
    });

    return groups;
}

function buildInfo(data) {
    var data = data.trim();
    var comma = data.indexOf(":");

    if (comma > 0 && data.substring(0, comma) === "build") {
        var space = data.indexOf(" ", comma);
        var file = data.substring(space + 1)

        return {
            type: data.substring(comma + 1, space),
            name: file,
            files: []
        }
    }
}

function isEndBuild(data) {
    return data.trim() === 'endbuild';
}
