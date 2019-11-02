import angular from 'angular';
import nrMainViewModule from './nrMainView/nrMainViewModule';
import nrNavViewModule from './nrNavView/nrNavViewModule';
import NrModuleName from "@norjs/ui/src/NrModuleName";

export default angular.module(
  NrModuleName.APP_VIEWS
  , [
    nrMainViewModule
    , nrNavViewModule
  ])
  .name;
