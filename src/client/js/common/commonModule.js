import angular from 'angular';
import iconModule from './icon/iconModule';
import navModule from './nav/navModule';
import windowModule from './window/windowModule';
import compileModule from './compile/compileModule';

export default angular.module(
  "norjs.common"
  , [
    iconModule
    , navModule
    , windowModule
    , compileModule
    // Keep in the same format, it helps with git merges
  ])
  .name;
