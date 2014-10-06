'use strict';

var metalsmith = require('metalsmith');
var asciidoc = require('metalsmith-asciidoc');
var collections = require('metalsmith-collections');
var drafts = require('metalsmith-drafts');
var fileMetadata = require('metalsmith-filemetadata');
var markdown = require('metalsmith-markdown');
var permalinks = require('metalsmith-permalinks');
var sass = require('metalsmith-sass');
var templates = require('metalsmith-templates');

var Handlebars = require('handlebars');
var moment = require('moment');

Handlebars.registerHelper('debug', function() {
  console.log(this);
});

Handlebars.registerHelper('formatDate', function(date) {
  return moment(date).format('MMMM Do, YYYY');
});

Handlebars.registerHelper('formatUTCDate', function(date) {
  return moment.utc(date).format('YYYY-MM-DD HH:mmZ');
});

// Allows specification of an index page for a category.
var indexes = function(config) {
  var path = require('path');

  return function(files, metalsmith, done) {
    setImmediate(done);

    Object.keys(files).forEach(function(filename) {
      var data = files[filename];

      if (!data.index) {
        return;
      }

      if (data.category === undefined) {
        throw new Error([
          'Index page',
          filename,
          'does not have a `category` specified. Please specify a `category` for this page.'
        ].join(' '));
      }

      data.permalink = false;

      var name = path.join(data.category, 'index' + path.extname(filename));

      delete files[filename];
      files[name] = data;
    });
  };
};

metalsmith(__dirname)
  .use(indexes())
  .use(collections({
    blogEntries: {
      pattern: 'content/blog/*.{md,markdown,adoc,asciidoc}',
      sortBy: 'date',
      reverse: true
    }
  }))
  .use(drafts())
  .use(fileMetadata([
    {
      pattern: 'content/blog/*.{md,markdown,adoc,asciidoc}',
      metadata: { category: 'blog', template: 'blog-entry.hbs' }
    }
  ]))
  .use(markdown({
    breaks: true,
    gfm: true,
    smartypants: true,
    tables: true
  }))
  .use(asciidoc())
  .use(permalinks({
    pattern: ':category/:date/:title'
  }))
  .use(sass({
    includePaths: [
      'bower_components/foundation/scss'
    ],
    outputDir: 'assets/css/',
    outputStyle: 'compressed'
  }))
  .use(templates({
    directory: 'templates',
    engine: 'handlebars',
    partials: {
      'blog-header': 'partials/blog-header',
      'blog-logo': 'partials/blog-logo',
      'home-header': 'partials/home-header',
      'home-logo': 'partials/home-logo',
      bottom: 'partials/bottom',
      navbar: 'partials/navbar',
      top: 'partials/top'
    }
  }))
  .destination('public')
  .build(function(err) {
    if (err) {
      throw err;
    }

    console.log('Successfully built site.');
  });
