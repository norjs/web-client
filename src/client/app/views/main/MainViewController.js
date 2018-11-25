
import NrViewController from "../../abstracts/NrViewController";

/**
 *
 * @ngInject
 */
class MainViewController extends NrViewController {

  /**
   *
   * @param $injector {$injector}
   * @ngInject
   * @param $element {$element}
   * @param $attrs {$attrs}
   * @param $scope {$scope}
   */
  constructor (
    $injector
    , $element
    , $attrs
    , $scope
  ) {
    super("nrMainViewController", $injector, $element, $attrs, $scope);
  }

}

export default MainViewController;
