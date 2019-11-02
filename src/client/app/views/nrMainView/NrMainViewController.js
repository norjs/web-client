
import NrViewController from "../../abstracts/NrViewController";

/**
 *
 * @ngInject
 */
class NrMainViewController extends NrViewController {

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
    super("nrMainViewController", $injector, $element, $attrs, $scope);
  }

}

export default NrMainViewController;
