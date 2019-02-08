
import NrViewController from "../../abstracts/NrViewController";

/**
 *
 * @ngInject
 */
class MainViewController extends NrViewController {

  /**
   *
   * @param $injector {$injector}
   * @param $element {$element}
   * @param $attrs {$attrs}
   * @param $scope {$scope}
   * @ngInject
   */
  constructor (
    $injector
    , $element
    , $attrs
    , $scope
  ) {
    'ngInject';
    super("nrMainViewController", $injector, $element, $attrs, $scope);
  }

}

export default MainViewController;
