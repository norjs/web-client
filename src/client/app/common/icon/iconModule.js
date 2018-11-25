import angular from 'angular';
import iconComponent from './iconComponent';

export default angular.module(
  "norjs.app.common.icon"
  , [

  ])
  .component('nrIcon', iconComponent)
  .name;
