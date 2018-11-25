import angular from 'angular';
import navViewComponent from './navViewComponent';

export default angular.module(
  "norjs.app.views.nav"
  , [

  ])
  .component('nrNavView', navViewComponent)
  .name;
