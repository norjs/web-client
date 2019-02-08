import _ from 'lodash';
import NrComponentController from "../../abstracts/NrComponentController";

/**
 *
 * @ngInject
 */
class NavController extends NrComponentController {

  /**
   *
   * @param $injector {$injector}
   * @param $element {$element}
   * @param $attrs {$attrs}
   * @param $scope {$scope}
   * @ngInject
   */
  constructor ($injector, $element, $attrs, $scope) {
    'ngInject';

    super("nrNavController", $injector, $element, $attrs, $scope);

    /**
     *
     * @member {$state}
     */
    this.$state = $injector.get('$state');

  }

  /**
   * @fixme: Use .registerLifeCycleMethods
   */
  $onInit () {
    super.$onInit();
    this.__collection = this.__collection || [];
    this.__options = this.__options || {};
  }

  getCollection () {
    if (this.__collection) return this.__collection;
    if (this.__options.getCollection) return this.__options.getCollection();
    return this.__options.collection || [];
  }

  getId (item) {
    if (this.__options.getId) return this.__options.getId(item);
    return item.id;
  }

  getHref (item) {
    if (this.__options.getHref) return this.__options.getHref(item);
    return this.getId(item);
  }

  hasIcon (item) {
    if (this.__options.hasIcon) return this.__options.hasIcon(item);
    return !!this.getIcon(item);
  }

  getIcon (item) {
    if (this.__options.getIcon) return this.__options.getIcon(item);
    return item.icon;
  }

  getLabel (item) {
    if (this.__options.getLabel) return this.__options.getLabel(item);
    return item.label;
  }

  isSelected (item) {
    if (this.__options.isSelected) return this.__options.isSelected(item);
    return this.isState(this.getId(item));
  }

  isVisible (item) {
    if (this.__options.isVisible) return this.__options.isVisible(item);
    return !!item;
  }

  /**
   * Returns current state name
   *
   * @returns {*}
   */
  getCurrentStateName () {
    return _.get(this.$state, 'current.name');
  }

  /**
   * Check if we are at the moment in state named `name`
   *
   * @param name
   * @returns {boolean}
   */
  isState (name) {
    return this.getCurrentStateName() === name;
  }

}

export default NavController;
