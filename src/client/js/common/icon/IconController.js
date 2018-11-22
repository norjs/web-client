import _ from 'lodash';
import NrComponentController from '../../abstracts/NrComponentController';

const PRIVATE = {
  type: Symbol('_type')
  , types: Symbol('_types')
};

/**
 *
 * @ngInject
 */
class IconController extends NrComponentController {

  /**
   *
   * @param $injector {$injector}
   * @param $element {$element}
   * @param $attrs {$attrs}
   * @param $scope {$scope}
   * @ngInject
   */
  constructor ($injector, $element, $attrs, $scope) {
    super("nrIconController", $injector, $element, $attrs, $scope);
  }

  /**
   *
   * @returns {*}
   */
  getClasses () {
    if (!this[PRIVATE.types]) return;
    return _.reduce(
      this[PRIVATE.types],
      (obj, key) => {
        obj['fa-' + key] = true;
        return obj;
      },
      {fa: true}
    );
  }

  /**
   *
   * @returns {*}
   * @private
   */
  get __type () {
    return this[PRIVATE.type];
  }

  /**
   *
   * @param value
   * @private
   */
  set __type (value) {
    this[PRIVATE.type] = value;
    this[PRIVATE.types] = value ? _.split(''+value, ' ') : [];
  }

}

export default IconController;
