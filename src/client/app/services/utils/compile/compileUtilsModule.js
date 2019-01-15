import angular from 'angular';
import CompileUtils from './CompileUtils';

export default angular.module(
  "norjs.app.utils.compile"
  , [
  ])
  .service('nrCompileUtils', CompileUtils)
  .name;
