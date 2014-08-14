'use strict';

var metalsmith = require('metalsmith');
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

Handlebars.registerHelper('date.format', function(date) {
  return moment(date).format('MMMM Do, YYYY');
});

Handlebars.registerHelper('date.formatUtcTime', function(date) {
  return moment.utc(date).format('YYYY-MM-DD HH:mmZ');
});

metalsmith(__dirname)
  .use(collections({
    blogEntries: {
      pattern: 'content/blog/*.md',
      sortBy: 'date',
      reverse: true
    }
  }))
  .use(drafts())
  .use(fileMetadata([
    {
      pattern: 'content/blog/*.md',
      metadata: { category: 'blog', template: 'blog-entry.hbs' }
    }
  ]))
  .use(markdown({
    gfm: true,
    smartypants: true
  }))
  .use(permalinks({
    pattern: ':category/:title'
  }))
  .use(sass({
    includePaths: [
      'bower_components/foundation/scss'
    ],
    outputDir: 'css/',
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
  .build(function(err) {
    if (err) {
      throw err;
    }

    console.log('Successfully built site.');
  });
