import angular from 'angular';
import CompileUtils from './CompileUtils';

export default angular.module(
  "norjs.utils.compile"
  , [
  ])
  .service('nrCompileUtils', CompileUtils)
  .name;
