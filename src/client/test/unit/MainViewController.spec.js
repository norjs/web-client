
describe('MainViewController', () => {
  let ctrl;

  beforeEach(() => {

    angular.mock.module('norjs.app.views.main');

  });

  xit('should contain the starter url', () => {
    expect(ctrl.url).toBe('https://github.com/preboot/angular-webpack');
  });

});
