import angular from 'angular';
import _ from 'lodash';
import uiRouter from 'angular-ui-router';
import angularTranslate from 'angular-translate';
import servicesModule from './services/servicesModule';
import commonModule from './common/commonModule';
import viewsModule from './views/viewsModule';
import uiRouterConfigurator from './config/uiRouterConfigurator';
import uiComponents from '@norjs/ui';
import 'reset-css';
import './app-styles.scss';

import CONFIG from "./norjsConfig.js";
const MODULES = CONFIG.modules ? CONFIG.modules : [];
const STATES = CONFIG.states;
const NAVS = CONFIG.navs;

import TRANSLATIONS from "./translations/index";

import { PREFERRED_LANGUAGE } from "./env";

const appModules = [
  angularTranslate
  , servicesModule
  , uiRouter
  , uiComponents
  , commonModule
  , viewsModule
];

_.forEach(MODULES, name => {
  appModules.push(name);
});

/**
 *
 * @param $logProvider
 * @ngInject
 */
function enableDebug ($logProvider) {
  'ngInject';
  $logProvider.debugEnabled(true);
}

/**
 *
 * @param $translateProvider
 * @ngInject
 */
function setupTranslation ($translateProvider) {
  'ngInject';
  _.forEach(_.keys(TRANSLATIONS), key => {
    $translateProvider.translations(key, TRANSLATIONS[key]);
  });
  //$translateProvider.preferredLanguage(PREFERRED_LANGUAGE);
}

export default angular.module(
    "norjs.app"
    , appModules
  )
  .constant("STATES", STATES)
  .constant("NAVS", NAVS)
  .config(enableDebug)
  .config(setupTranslation)
  .config(uiRouterConfigurator(STATES))
  .name;
