import angular from 'angular';
import testComponentComponent from './testComponentComponent';

export default angular.module(
  "test.mocks.testComponent"
  , [

  ])
  .component('testComponent', testComponentComponent)
  .name;
