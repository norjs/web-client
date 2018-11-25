import NrController from "./NrController";

/**
 * Abstract base class for AngularJS component controllers.
 *
 * @abstract
 */
export default class NrComponentController extends NrController {

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

    super(name, $injector);

    /**
     * @member {$element}
     * @protected
     */
    this.$element = $element;

    /**
     * @member {$attrs}
     * @protected
     */
    this.$attrs = $attrs;

    /**
     * @member {$scope}
     * @protected
     */
    this.$scope = $scope;

  }

}
