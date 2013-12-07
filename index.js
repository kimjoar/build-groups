var parseTree = require('html-parse-tree');

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
    var build = null;

    items.forEach(function(item) {
        if (item.type === 'comment') {
            if (isEndBuild(item.data)) {
                if (build) {
                    groups.push(build);
                    build = null;
                }
            } else {
                if (build) return;
                var newBuild = buildInfo(item.data);
                if (newBuild) build = newBuild;
            }
        } else if (item.type === 'tag') {
            var name = item.name;
            if (build && (name === 'script' || name === 'link')) {
                build.files.push(item.attrs);
            } else {
                findGroups(item.children, groups)
            }
        }
    });

    return groups;
}

function buildInfo(data) {
    var data = data.trim();
    var sep = data.indexOf(":");

    if (sep > 0 && data.substring(0, sep) === "build") {
        var space = data.indexOf(" ", sep);
        var file = data.substring(space + 1)

        return {
            type: data.substring(sep + 1, space),
            name: file,
            files: []
        }
    }
}

function isEndBuild(data) {
    return data.trim() === 'endbuild';
}
