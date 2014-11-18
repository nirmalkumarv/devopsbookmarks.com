var _u = require('underscore');
var walk = require('walk');
var fs = require('fs');

var topics = JSON.parse(fs.readFileSync(__dirname + '/topics.json'));
var platforms = JSON.parse(fs.readFileSync(__dirname + '/platforms.json'));
var licenses = JSON.parse(fs.readFileSync(__dirname + '/licenses.json'));
var tools = [];

exports.topics = _u.indexBy(topics, 'slug');
exports.platforms = _u.indexBy(platforms, 'slug');
exports.licenses = _u.indexBy(licenses, 'slug');
exports.tools = tools;

walker = walk.walk(__dirname + '/tools/');

walker.on('file', function(root, fileStats, next) {
  if (fileStats.name.match(/.json$/)) {
    var toolStr = fs.readFileSync(root + '/' + fileStats.name, 'utf-8');
    var toolJson = JSON.parse(toolStr);
    toolJson.forEach(function(tool) {
      tool.topics = _u.reduce(tool.tags, function(applied_topics, tag) {
        return _u.reduce(topics, function(applied_topics, topic) {
          if (_u.contains(topic.include_tags, tag)) {
            applied_topics.push(topic.slug);
          }
          return applied_topics;
        }, applied_topics);
      }, []);

      tools.push(tool);
    });
  }

  next();
});

walker.on('end', function() {
  console.log('Read ' + tools.length + ' tools');
});
