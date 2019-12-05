
// Modules
const _ = require('lodash');
const PATH = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
const LicensePlugin = require('webpack-license-plugin');

const NORJS_ROOT_DIR = PATH.resolve(__dirname);
const NORJS_SOURCE_DIR = PATH.join(NORJS_ROOT_DIR, './app');
const NORJS_PUBLIC_DIR = process.env.NORJS_PUBLIC_DIR ? process.env.NORJS_PUBLIC_DIR : PATH.join(NORJS_SOURCE_DIR, './public');
const NORJS_DIST_DIR = process.env.NORJS_DIST_DIR ? process.env.NORJS_DIST_DIR : PATH.join(NORJS_ROOT_DIR, './dist');
const NORJS_API_URL = "http://localhost:3000";

const NORJS_CONFIG_FILE = PATH.resolve(_.get(process, 'env.NORJS_CONFIG_FILE') || PATH.join(NORJS_SOURCE_DIR, './app.json'));
const NORJS_EXTERNAL_FILES = PATH.resolve(_.get(process, 'env.NORJS_EXTERNAL_FILES') || '');

/**
 *
 * @type {string[]}
 */
const ACCEPTED_LICENSES_LIST = process.env.NORJS_ACCEPTED_LICENSE_LIST ? process.env.NORJS_ACCEPTED_LICENSE_LIST.split(' ') : [
  'MIT',
  'Apache-2.0',
  '(OFL-1.1 AND MIT)',
  'Unlicense'
];

/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
const ENV = process.env.npm_lifecycle_event;
const isTest = ENV === 'test' || ENV === 'test-watch';
const isProd = ENV === 'build' || ENV === 'prod' || ENV === 'server-prod';

const csvLicenseTransform = (packages) => {

  const keys = ['name', 'version', 'license'];

  return [
    '"sep=,"',
    keys.join(','),
    ...packages.map(package => keys.map(key => `="${package[key]}"`).join(',')),
  ].join('\n') + '\n';

};

const mdLicenseTransform = (packages) => {

  return [
    '| Name | Version | License |',
    '|------|---------[---------|',
    ...packages.map( package => `| [${package.name}](${package.repository}) |  ${package.version} | ${package.license} |` ),
  ].join('\n') + '\n';

};

module.exports = function makeWebpackConfig() {
  /**
   * Config
   * Reference: http://webpack.github.io/docs/configuration.html
   * This is the object where all configuration gets set
   */
  const config = {};

  config.mode = isProd ? 'production' : 'development';

  config.performance = isTest ? void 0 : {
    hints:false
  };

  config.context = NORJS_SOURCE_DIR;

  const appEntries = [];

  if (NORJS_EXTERNAL_FILES) {
    _.forEach(_.split(NORJS_EXTERNAL_FILES, ':'), file => {
      appEntries.push(file);
    });
  }

  appEntries.push(PATH.join(NORJS_SOURCE_DIR, './nrAppModule.js'));

  /**
   * Entry
   * Reference: http://webpack.github.io/docs/configuration.html#entry
   * Should be an empty object if it's generating a test build
   * Karma will set this when it's a test build
   */
  config.entry = isTest ? void 0 : {
    app: appEntries
  };

  /**
   * Output
   * Reference: http://webpack.github.io/docs/configuration.html#output
   * Should be an empty object if it's generating a test build
   * Karma will handle setting it up for you when it's a test build
   */
  config.output = isTest ? {} : {

    // Absolute output directory
    path: NORJS_DIST_DIR,

    // Output path from the view of the page
    // Uses webpack-dev-server in development
    publicPath: '/',

    // Filename for entry points
    // Only adds hash in build mode
    filename: isProd ? '[name].[hash].js' : '[name].bundle.js',

    // Filename for non-entry points
    // Only adds hash in build mode
    chunkFilename: isProd ? '[name].[hash].js' : '[name].bundle.js'

  };

  config.resolve = {
    modules: [
      PATH.join(NORJS_ROOT_DIR, './node_modules')
    ],
    alias: {
      "norjs": PATH.join(NORJS_SOURCE_DIR, './index.js')
    }
  };

  /**
   * Devtool
   * Reference: http://webpack.github.io/docs/configuration.html#devtool
   * Type of sourcemap to use per build type
   */
  if (isTest) {
    config.devtool = 'inline-source-map';
  }
  else if (isProd) {
    config.devtool = 'source-map';
  }
  else {
    config.devtool = 'eval-source-map';
  }

  /**
   * Loaders
   * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
   * List: http://webpack.github.io/docs/list-of-loaders.html
   * This handles most of the magic responsible for converting modules
   */

  // Initialize module
  config.module = {
    rules: [
      {
        // JS LOADER
        // Reference: https://github.com/babel/babel-loader
        // Transpile .js files using babel-loader
        // Compiles ES6 and ES7 into ES5 code
        test: /node_modules\/@novnc\/.*\.js$/,
        loader: [
          'babel-loader'
        ]
      },
      {
        // JS LOADER
        // Reference: https://github.com/babel/babel-loader
        // Transpile .js files using babel-loader
        // Compiles ES6 and ES7 into ES5 code
        test: /\.js$/,
        use: [
          {
            loader: 'ng-annotate-loader',
            options: {
              ngAnnotate: "ng-annotate-patched",
              es6: true,
              explicitOnly: false
            }
          },
          {
            loader: 'babel-loader'
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.scss$|\.css$/,
        use: [
          "style-loader", // creates style nodes from JS strings
          "css-loader", // translates CSS into CommonJS
          "sass-loader" // compiles Sass to CSS, using Node Sass by default
        ]
      },
      {
        // ASSET LOADER
        // Reference: https://github.com/webpack/file-loader
        // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
        // Rename the file using the asset hash
        // Pass along the updated reference to your code
        // You can add here any file extension you want to get copied to your output
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
        loader: 'file-loader'
      }, {
        // HTML LOADER
        // Reference: https://github.com/webpack/raw-loader
        // Allow loading html through js
        test: /\.html$/,
        loader: 'raw-loader'
      },
      // font-awesome
      {
        test: /font-awesome\.config\.js/,
        use: [
          { loader: 'style-loader' },
          { loader: 'font-awesome-loader' }
        ]
      }
    ]
  };

  // ISTANBUL LOADER
  // https://github.com/deepsweet/istanbul-instrumenter-loader
  // Instrument JS files with istanbul-lib-instrument for subsequent code coverage reporting
  // Skips node_modules and files that end with .spec.js
  if (isTest) {
    config.module.rules.push({
      enforce: 'pre',
      test: /\.js$/,
      exclude: [
        /node_modules/,
        /\.spec\.js$/
      ],
      loader: 'istanbul-instrumenter-loader',
      query: {
        esModules: true
      }
    })
  }

  /**
   * PostCSS
   * Reference: https://github.com/postcss/autoprefixer-core
   * Add vendor prefixes to your css
   */
   // NOTE: This is now handled in the `postcss.config.js`
   //       webpack2 has some issues, making the config file necessary

  // noinspection JSPotentiallyInvalidConstructorUsage
  /**
   * Plugins
   * Reference: http://webpack.github.io/docs/configuration.html#plugins
   * List: http://webpack.github.io/docs/list-of-plugins.html
   */
  config.plugins = [

    // there might be other plugins here
    new LicensePlugin({
      additionalFiles: {
        'oss-licenses.csv': csvLicenseTransform,
        'oss-licenses.md': mdLicenseTransform
      },
      excludedPackageTest: (packageName, version) => {
        return packageName.startsWith('@norjs/')
      },
      unacceptableLicenseTest: (licenseIdentifier) => !ACCEPTED_LICENSES_LIST.includes(licenseIdentifier)
    }),

    new ngAnnotatePlugin({
      add: true,
      // other ng-annotate options here
    }),

    new webpack.LoaderOptionsPlugin({
      test: /\.scss$/i,
      options: {
        postcss: {
          plugins: [autoprefixer]
        }
      }
    }),

    new webpack.DefinePlugin({
      'NORJS_BUILD_CONFIG': JSON.stringify(require(NORJS_CONFIG_FILE))
    })

  ];

  // Skip rendering index.html in test mode
  if (!isTest) {
    // Reference: https://github.com/ampedandwired/html-webpack-plugin
    // Render index.html
    config.plugins.push(
      new HtmlWebpackPlugin({
        template: PATH.join(NORJS_PUBLIC_DIR, './index.html'),
        inject: 'body'
      })
    );
  }

  config.optimization = {
    minimize: !!isProd
  };

  // Add build specific plugins
  if (isProd) {

    config.plugins.push(
      // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
      // Only emit files when there are no errors
      new webpack.NoEmitOnErrorsPlugin(),

      // Copy assets from the public folder
      // Reference: https://github.com/kevlened/copy-webpack-plugin
      new CopyWebpackPlugin([{
        from: NORJS_PUBLIC_DIR
      }])
    )
  }


  /**
   * Dev server configuration
   * Reference: http://webpack.github.io/docs/configuration.html#devserver
   * Reference: http://webpack.github.io/docs/webpack-dev-server.html
   */
  config.devServer = {
    contentBase: NORJS_PUBLIC_DIR,
    stats: 'minimal',
    host: '0.0.0.0',
    proxy: {
      "/api/*": {
        target: NORJS_API_URL
      }
    }
  };

  return config;
}();
