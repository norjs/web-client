import angular from 'angular';
import nrNavViewComponent from './nrNavViewComponent';
import NrModuleName from "@norjs/ui/src/NrModuleName";
import NrTag from "@norjs/ui/src/NrTag";

export const nrNavViewModule = angular.module(
  NrModuleName.APP_NAV_VIEW
  , [

  ])
  .component(NrTag.NAV_VIEW, nrNavViewComponent)
  .name;

export default nrNavViewModule;
