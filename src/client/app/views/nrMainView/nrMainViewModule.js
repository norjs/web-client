import angular from 'angular';
import nrMainViewComponent from './nrMainViewComponent';
import NrModuleName from "@norjs/ui/src/NrModuleName";
import NrTag from "@norjs/ui/src/NrTag";

export const nrMainViewModule = angular.module(
  NrModuleName.APP_MAIN_VIEW
  , [

  ])
  .component(NrTag.MAIN_VIEW, nrMainViewComponent)
  .name;

export default nrMainViewModule;
