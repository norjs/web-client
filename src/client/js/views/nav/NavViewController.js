
import NrViewController from '../../abstracts/NrViewController';

/**
 *
 * @ngInject
 */
class NavViewController extends NrViewController {

  /**
   *
   * @param $injector {$injector}
   * @param $element {$element}
   * @param $attrs {$attrs}
   * @param $scope {$scope}
   * @ngInject
   */
  constructor ($injector, $element, $attrs, $scope, NAVS) {
    super("NrNavViewController", $injector, $element, $attrs, $scope);

    this.nav = _.cloneDeep(NAVS.top);
    this.nav.getId = item => item.id;
    this.nav.getHref = item => item.href || item.id;
    this.nav.getIcon = item => item.icon;
    this.nav.getLabel = item => item.label;
    this.nav.isVisible = item => item.visible === undefined ? true : item.visible;

  }

}

export default NavViewController;
