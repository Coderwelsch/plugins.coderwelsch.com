var context = require.context( "./js/es6", true, /-spec\.js$/ );
context.keys().forEach( context );