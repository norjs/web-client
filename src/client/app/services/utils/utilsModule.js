import angular from 'angular';
import compileUtilsModule from './compile/compileUtilsModule';

export default angular.module(
  "norjs.app.services.utils"
  , [
    compileUtilsModule

    // Keep in the same format, continue above with: , fooServiceModule
  ])
  .name;
