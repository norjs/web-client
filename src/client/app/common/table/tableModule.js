import angular from 'angular';
import tableComponent from './tableComponent';
import TableService from './TableService';

export default angular.module(
  "app.common.table"
  , [

  ])
  .component('nrTable', tableComponent)
  .service('tableService', TableService)
  .name;
