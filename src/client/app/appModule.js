import angular from 'angular';
import _ from 'lodash';
import uiRouter from 'angular-ui-router';
import angularTranslate from 'angular-translate';
import servicesModule from './services/servicesModule';
import utilsModule from './utils/utilsModule';
import commonModule from './common/commonModule';
import viewsModule from './views/viewsModule';
import uiRouterConfigurator from './config/uiRouterConfigurator';
import 'reset-css';
import './app-styles.scss';

import CONFIG from "./norjsConfig.js";
const STATES = CONFIG.states;
const NAVS = CONFIG.navs;

import TRANSLATIONS from "./translations/index";

import { PREFERRED_LANGUAGE } from "./env";

export default angular.module(
  "norjs.app"
  , [
    angularTranslate
    , utilsModule
    , servicesModule
    , uiRouter
    , commonModule
    , viewsModule
  ])
  .constant("STATES", STATES)
  .constant("NAVS", NAVS)
  .config($logProvider => {
    $logProvider.debugEnabled(true);
  })
  .config($translateProvider => {
    _.forEach(_.keys(TRANSLATIONS), key => {
      $translateProvider.translations(key, TRANSLATIONS[key]);
    });
    $translateProvider.preferredLanguage(PREFERRED_LANGUAGE);
  })
  .config(uiRouterConfigurator(STATES))
  .name;
