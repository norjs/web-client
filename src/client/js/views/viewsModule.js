import angular from 'angular';
import mainViewModule from './main/mainViewModule';

export default angular.module(
  "norjs.views"
  , [
    mainViewModule
  ])
  .name;
