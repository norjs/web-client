import NrComponentController from "./NrComponentController";

/**
 *
 * @abstract
 */
export default class NrViewController extends NrComponentController {

  /**
   *
   * @param name {string} Name of concrete class
   * @param $injector {$injector}
   * @param $element {$element}
   * @param $attrs {$attrs}
   * @param $scope {$scope}
   * @protected
   * @ngInject
   */
  constructor (name, $injector, $element, $attrs, $scope) {
    'ngInject';

    super(name, $injector, $element, $attrs, $scope);

    /**
     *
     * @member {$state}
     */
    this.$state = $injector.get('$state');

  }

}
