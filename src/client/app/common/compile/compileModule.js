import angular from 'angular';
import compileComponent from './compileComponent';

export default angular.module(
  "norjs.app.common.compile"
  , [

  ])
  .component('nrCompile', compileComponent)
  .name;
