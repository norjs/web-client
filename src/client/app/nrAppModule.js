import 'reset-css';
import './nr-app-styles.scss';

import angular from 'angular';
import _ from 'lodash';
import angularUiRouter from 'angular-ui-router';
import angularTranslate from 'angular-translate';
import nrViewsModule from './views/nrViewsModule';
import nrUiRouterConfigurator from './nrConfig/nrUiRouterConfigurator';
import nrUiModule from '@norjs/ui';

import CONFIG from "./norjsConfig.js";
const MODULES = CONFIG.modules ? CONFIG.modules : [];
const STATES = CONFIG.states;
const NAVS = CONFIG.navs;

import TRANSLATIONS from "./nrTranslations/index";

import { PREFERRED_LANGUAGE } from "./nrEnv";
import NrModuleName from "@norjs/ui/src/NrModuleName";

const APP_MODULES = [
  angularTranslate
  , angularUiRouter
  , nrUiModule
  , nrViewsModule
];

_.forEach(MODULES, name => {
  APP_MODULES.push(name);
});

/**
 *
 * @param $logProvider
 * @fixme Only enable when running in development mode
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

export const nrAppModule = angular.module(NrModuleName.APP, APP_MODULES)
  .constant("STATES", STATES) // FIXME: Rename as NORJS_STATES
  .constant("NAVS", NAVS) // FIXME: Rename as NORJS_NAVS
  .config(enableDebug)
  .config(setupTranslation)
  .config(nrUiRouterConfigurator(STATES))
  .name;

// noinspection JSUnusedGlobalSymbols
export default nrAppModule;
