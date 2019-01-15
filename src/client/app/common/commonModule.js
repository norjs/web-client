import angular from 'angular';
import iconModule from './icon/iconModule';
import navModule from './nav/navModule';
import windowModule from './window/windowModule';
import compileModule from './compile/compileModule';
import tableModule from './table/tableModule';

export default angular.module(
  "norjs.app.common"
  , [
    iconModule
    , navModule
    , windowModule
    , compileModule
    , tableModule
    // Keep in the same format, it helps with git merges
  ])
  .name;
