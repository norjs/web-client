import angular from 'angular';
import testComponentComponent from './testComponentComponent';

export default angular.module(
  "norjs.test.mocks.testComponent"
  , [

  ])
  .component('testComponent', testComponentComponent)
  .name;
