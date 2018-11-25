// This file is an entry point for angular tests
// Avoids some weird issues when using webpack + angular.

import 'babel-polyfill';
import 'angular';
import 'angular-mocks/angular-mocks';
import './app/appModule.js';
import './test/mocks/testMocksModule';

const context = require.context('./test', true, /\.js$/);

context.keys().forEach(context);
