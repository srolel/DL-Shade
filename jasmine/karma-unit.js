var grunt = require('grunt');
module.exports = function ( karma ) {
    karma.set({
        /**
         * From where to look for files, starting with the location of this file.
         */
        basePath: '.',

        /**
         * This is the list of file patterns to load into the browser during testing.
         */
        files: [
            "http://code.angularjs.org/1.2.1/angular.js",
            "http://code.angularjs.org/1.2.1/angular-mocks.js",
            "public/scripts/Shade/directives/vText.coffee",
            "jasmine/spec/angular/vTextSpec.js"
        ],

        preprocessors: {
            'src/angular-stepper.js': ['coverage']
        },

        frameworks: [ 'jasmine' ],
        plugins: [ 'karma-jasmine', 'karma-firefox-launcher', 'karma-chrome-launcher', 'karma-coverage'],

        logLevel:  'WARN',
        /**
         * How to report, by default.
         */
        reporters: ['dots', 'coverage'],

        coverageReporter: {
            type : 'html',
            dir : 'coverage/'
        },
        /**
         * On which port should the browser connect, on which port is the test runner
         * operating, and what is the URL path for the browser to use.
         */
        port: 7019,
        urlRoot: '/',

        /**
         * Disable file watching by default.
         */
        autoWatch: false,

        /**
         * The list of browsers to launch to test ondest     * default, but other browser names include:
         * Chrome, ChromeCanary, Firefox, Opera, Safari, PhantomJS
         *
         * Note that you can also use the executable name of the browser, like "chromium"
         * or "firefox", but that these vary based on your operating system.
         *
         * You may also leave this blank and manually navigate your browser to
         * http://localhost:9018/ when you're running tests. The window/tab can be left
         * open and the tests will automatically occur there during the build. This has
         * the aesthetic advantage of not launching a browser every time you save.
         */
        browsers: [
            'Chrome'
        ]
    });
};
