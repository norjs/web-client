
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
  constructor ($injector, $element, $attrs, $scope, STATES) {
    super("nrMainViewController", $injector, $element, $attrs, $scope);

    this.STATES = STATES;

    /**
     * @member {SessionService}
     */
    this._sessionService = $injector.get('sessionService');

    /**
     *
     * @type {string}
     */
    this.url = 'https://github.com/preboot/angular-webpack';

    this.model = {};

  }

  /**
   * Use .setupLifecycleHooks()
   */
  $onInit () {
    super.$onInit();

    if (!this._sessionService.hasSession()) {
      this.$state.go(this.STATES.login.name);
      return;
    }

  }

  setForm (form) {
    this.form = form;
    console.log('this.form = ', this.form);
  }

  onSubmit ($event) {
    console.log('WOOT MainViewController - onClick: ', $event);
  }

}

export default MainViewController;
