import angular from 'angular';
import mainViewModule from './main/mainViewModule';
import navViewModule from './nav/navViewModule';

export default angular.module(
  "norjs.app.views"
  , [
    mainViewModule
    , navViewModule
  ])
  .name;
