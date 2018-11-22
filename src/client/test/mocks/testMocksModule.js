import angular from 'angular';
import testComponentModule from './testComponent/testComponentModule';

export default angular.module(
  "test.mocks"
  , [
    testComponentModule
  ])
  .name;
