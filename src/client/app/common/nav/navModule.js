import angular from 'angular';
import navComponent from './navComponent';

export default angular.module(
  "norjs.app.common.nav"
  , [

  ])
  .component('nrNav', navComponent)
  .name;
