import angular from 'angular';
import utilsModule from './utils/utilsModule';

export default angular.module(
  "norjs.app.services"
  , [
    utilsModule
    // Keep in the same format, continue with: , fooServiceModule
  ])
  .name;
