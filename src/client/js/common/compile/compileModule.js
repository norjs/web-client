import angular from 'angular';
import compileComponent from './compileComponent';

export default angular.module(
  "norjs.common.compile"
  , [

  ])
  .component('nrCompile', compileComponent)
  .name;
