import angular from 'angular';
import testComponentModule from './testComponent/testComponentModule';

export default angular.module(
  "norjs.test.mocks"
  , [
    testComponentModule
  ])
  .name;
